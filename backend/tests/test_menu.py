import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Category, MenuItem, Store


@pytest.fixture
async def admin_token(client, db: AsyncSession):
    from passlib.context import CryptContext
    from app.database.models import Admin
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    store = Store(name="Test", store_identifier="menutest")
    db.add(store)
    await db.flush()
    admin = Admin(store_id=store.id, username="admin", password_hash=pwd.hash("pass"))
    db.add(admin)
    await db.commit()
    resp = await client.post("/api/auth/admin/login", json={
        "store_identifier": "menutest", "username": "admin", "password": "pass"
    })
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_category(client, admin_token):
    resp = await client.post(
        "/api/menu/admin/categories",
        json={"name": "Main", "display_order": 1},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 201
    assert resp.json()["name"] == "Main"


@pytest.mark.asyncio
async def test_delete_category_with_items_blocked(client, admin_token, db: AsyncSession):
    cat = Category(store_id=1, name="Cat", display_order=0)
    db.add(cat)
    await db.flush()
    item = MenuItem(category_id=cat.id, name="Item", price=1000, display_order=0)
    db.add(item)
    await db.commit()

    resp = await client.delete(
        f"/api/menu/admin/categories/{cat.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 400
