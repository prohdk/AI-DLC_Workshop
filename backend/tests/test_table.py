import pytest
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Admin, Category, MenuItem, Store, Table

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


@pytest.fixture
async def setup_table(client, db: AsyncSession):
    store = Store(name="Test", store_identifier="tabletest")
    db.add(store)
    await db.flush()
    admin = Admin(store_id=store.id, username="admin", password_hash=pwd.hash("pass"))
    table = Table(store_id=store.id, table_number=5, password_hash=pwd.hash("tpass"))
    cat = Category(store_id=store.id, name="Food", display_order=0)
    db.add_all([admin, table, cat])
    await db.flush()
    item = MenuItem(category_id=cat.id, name="Pizza", price=12000, display_order=0)
    db.add(item)
    await db.commit()

    admin_resp = await client.post("/api/auth/admin/login", json={
        "store_identifier": "tabletest", "username": "admin", "password": "pass"
    })
    table_resp = await client.post("/api/auth/table/login", json={
        "store_identifier": "tabletest", "table_number": 5, "password": "tpass"
    })
    return {
        "admin_token": admin_resp.json()["access_token"],
        "table_token": table_resp.json()["access_token"],
        "table_id": table.id,
        "menu_item_id": item.id,
    }


@pytest.mark.asyncio
async def test_setup_table(client, setup_table):
    resp = await client.post(
        "/api/tables",
        json={"table_number": 10, "password": "newpass"},
        headers={"Authorization": f"Bearer {setup_table['admin_token']}"},
    )
    assert resp.status_code == 201
    assert resp.json()["table_number"] == 10


@pytest.mark.asyncio
async def test_complete_session_no_active(client, setup_table):
    resp = await client.post(
        f"/api/tables/{setup_table['table_id']}/complete",
        headers={"Authorization": f"Bearer {setup_table['admin_token']}"},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_complete_session_with_orders(client, setup_table):
    # Create order (auto-creates session)
    await client.post(
        "/api/orders",
        json={"items": [{"menu_item_id": setup_table["menu_item_id"], "quantity": 1}]},
        headers={"Authorization": f"Bearer {setup_table['table_token']}"},
    )

    # Complete session
    resp = await client.post(
        f"/api/tables/{setup_table['table_id']}/complete",
        headers={"Authorization": f"Bearer {setup_table['admin_token']}"},
    )
    assert resp.status_code == 204

    # Check history
    resp = await client.get(
        f"/api/tables/{setup_table['table_id']}/history",
        headers={"Authorization": f"Bearer {setup_table['admin_token']}"},
    )
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["total_amount"] == 12000
