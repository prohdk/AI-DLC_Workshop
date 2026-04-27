import time
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database.models import Admin, Store, Table

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory login attempt tracker: {key: (fail_count, last_fail_time)}
_login_attempts: dict[str, tuple[int, float]] = {}


def _check_lockout(key: str) -> None:
    if key not in _login_attempts:
        return
    count, last_fail = _login_attempts[key]
    if count >= settings.login_max_attempts:
        elapsed = time.time() - last_fail
        if elapsed < settings.login_lockout_minutes * 60:
            raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")


def _record_failure(key: str) -> None:
    count, _ = _login_attempts.get(key, (0, 0.0))
    _login_attempts[key] = (count + 1, time.time())


def _clear_attempts(key: str) -> None:
    _login_attempts.pop(key, None)


def _create_token(sub: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expire_hours)
    payload = {"sub": str(sub), "role": role, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


async def admin_login(
    db: AsyncSession, store_identifier: str, username: str, password: str
) -> str:
    key = f"{store_identifier}:{username}"
    _check_lockout(key)

    result = await db.execute(
        select(Store).where(Store.store_identifier == store_identifier)
    )
    store = result.scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    result = await db.execute(
        select(Admin).where(Admin.store_id == store.id, Admin.username == username)
    )
    admin = result.scalar_one_or_none()
    if not admin or not pwd_context.verify(password, admin.password_hash):
        _record_failure(key)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    _clear_attempts(key)
    return _create_token(admin.id, "admin")


async def table_login(
    db: AsyncSession, store_identifier: str, table_number: int, password: str
) -> str:
    result = await db.execute(
        select(Store).where(Store.store_identifier == store_identifier)
    )
    store = result.scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    result = await db.execute(
        select(Table).where(Table.store_id == store.id, Table.table_number == table_number)
    )
    table = result.scalar_one_or_none()
    if not table or not pwd_context.verify(password, table.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return _create_token(table.id, "table")
