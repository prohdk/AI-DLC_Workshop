from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Admin, Store

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_data(db: AsyncSession) -> None:
    result = await db.execute(select(Store).where(Store.store_identifier == "store1"))
    if result.scalar_one_or_none():
        return

    store = Store(name="테스트 매장", store_identifier="store1")
    db.add(store)
    await db.flush()

    admin = Admin(
        store_id=store.id,
        username="admin",
        password_hash=pwd_context.hash("admin1234"),
    )
    db.add(admin)
    await db.commit()
