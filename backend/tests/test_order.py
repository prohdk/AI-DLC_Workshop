import pytest
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Admin, Category, MenuItem, Store, Table

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


@pytest.fixture
async def setup_order(client, db: AsyncSession):
    store = Store(name="Test", store_identifier="ordertest")
    db.add(store)
    await db.flush()
    admin = Admin(store_id=store.id, username="admin", password_hash=pwd.hash("pass"))
    table = Table(store_id=store.id, table_number=1, password_hash=pwd.hash("tpass"))
    cat = Category(store_id=store.id, name="Food", display_order=0)
    db.add_all([admin, table, cat])
    await db.flush()
    item = MenuItem(category_id=cat.id, name="Burger", price=8000, display_order=0)
    db.add(item)
    await db.commit()

    admin_resp = await client.post("/api/auth/admin/login", json={
        "store_identifier": "ordertest", "username": "admin", "password": "pass"
    })
    table_resp = await client.post("/api/auth/table/login", json={
        "store_identifier": "ordertest", "table_number": 1, "password": "tpass"
    })
    return {
        "admin_token": admin_resp.json()["access_token"],
        "table_token": table_resp.json()["access_token"],
        "menu_item_id": item.id,
    }


@pytest.mark.asyncio
async def test_create_order(client, setup_order):
    resp = await client.post(
        "/api/orders",
        json={"items": [{"menu_item_id": setup_order["menu_item_id"], "quantity": 2}]},
        headers={"Authorization": f"Bearer {setup_order['table_token']}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["total_amount"] == 16000
    assert data["status"] == "pending"
    assert len(data["items"]) == 1


@pytest.mark.asyncio
async def test_order_status_transition(client, setup_order):
    # Create order
    resp = await client.post(
        "/api/orders",
        json={"items": [{"menu_item_id": setup_order["menu_item_id"], "quantity": 1}]},
        headers={"Authorization": f"Bearer {setup_order['table_token']}"},
    )
    order_id = resp.json()["id"]

    # Valid: pending -> preparing
    resp = await client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "preparing"},
        headers={"Authorization": f"Bearer {setup_order['admin_token']}"},
    )
    assert resp.status_code == 200

    # Invalid: preparing -> pending (reverse)
    resp = await client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "pending"},
        headers={"Authorization": f"Bearer {setup_order['admin_token']}"},
    )
    assert resp.status_code == 400
