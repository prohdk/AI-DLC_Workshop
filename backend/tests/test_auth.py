import pytest
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Admin, Store, Table

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


@pytest.fixture
async def seed(db: AsyncSession):
    store = Store(name="Test", store_identifier="test1")
    db.add(store)
    await db.flush()
    admin = Admin(store_id=store.id, username="admin", password_hash=pwd.hash("pass123"))
    db.add(admin)
    table = Table(store_id=store.id, table_number=1, password_hash=pwd.hash("table123"))
    db.add(table)
    await db.commit()


@pytest.mark.asyncio
async def test_admin_login_success(client, seed):
    resp = await client.post("/api/auth/admin/login", json={
        "store_identifier": "test1", "username": "admin", "password": "pass123"
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.asyncio
async def test_admin_login_wrong_password(client, seed):
    resp = await client.post("/api/auth/admin/login", json={
        "store_identifier": "test1", "username": "admin", "password": "wrong"
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_table_login_success(client, seed):
    resp = await client.post("/api/auth/table/login", json={
        "store_identifier": "test1", "table_number": 1, "password": "table123"
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()
