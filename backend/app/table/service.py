from datetime import date, datetime

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.models import (
    Order,
    OrderHistory,
    OrderHistoryItem,
    OrderItem,
    Table,
    TableSession,
)
from app.sse.service import sse_manager

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def list_tables(db: AsyncSession, store_id: int) -> list[Table]:
    result = await db.execute(
        select(Table).where(Table.store_id == store_id).order_by(Table.table_number)
    )
    return list(result.scalars().all())


async def setup_table(db: AsyncSession, store_id: int, table_number: int, password: str) -> Table:
    # Check if table already exists
    result = await db.execute(
        select(Table).where(Table.store_id == store_id, Table.table_number == table_number)
    )
    existing = result.scalar_one_or_none()
    if existing:
        existing.password_hash = pwd_context.hash(password)
        await db.commit()
        await db.refresh(existing)
        return existing

    table = Table(
        store_id=store_id,
        table_number=table_number,
        password_hash=pwd_context.hash(password),
    )
    db.add(table)
    await db.commit()
    await db.refresh(table)
    return table


async def get_table_summary(db: AsyncSession, table_id: int) -> dict:
    table = await db.get(Table, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    total = 0
    count = 0
    if table.current_session_id:
        result = await db.execute(
            select(
                func.coalesce(func.sum(Order.total_amount), 0),
                func.count(Order.id),
            ).where(Order.session_id == table.current_session_id)
        )
        row = result.one()
        total = row[0]
        count = row[1]

    return {
        "id": table.id,
        "table_number": table.table_number,
        "current_session_id": table.current_session_id,
        "total_amount": total,
        "order_count": count,
    }


async def complete_table_session(db: AsyncSession, table_id: int) -> None:
    table = await db.get(Table, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    if not table.current_session_id:
        raise HTTPException(status_code=400, detail="No active session")

    session_id = table.current_session_id

    # Fetch all orders for this session
    result = await db.execute(
        select(Order)
        .where(Order.session_id == session_id)
        .options(selectinload(Order.items))
    )
    orders = list(result.scalars().all())

    # Archive each order
    for order in orders:
        history = OrderHistory(
            table_id=table.id,
            session_id=session_id,
            order_number=order.id,
            status=order.status.value,
            total_amount=order.total_amount,
            created_at=order.created_at,
        )
        db.add(history)
        await db.flush()

        for oi in order.items:
            hi = OrderHistoryItem(
                order_history_id=history.id,
                menu_name=oi.menu_name,
                quantity=oi.quantity,
                unit_price=oi.unit_price,
            )
            db.add(hi)

        await db.delete(order)

    # Close session
    session = await db.get(TableSession, session_id)
    if session:
        session.completed_at = datetime.utcnow()

    table.current_session_id = None
    await db.commit()

    await sse_manager.publish("session_completed", {
        "table_id": table.id,
        "table_number": table.table_number,
        "session_id": session_id,
    })


async def get_order_history(
    db: AsyncSession, table_id: int, date_filter: date | None = None
) -> list[OrderHistory]:
    stmt = (
        select(OrderHistory)
        .where(OrderHistory.table_id == table_id)
        .options(selectinload(OrderHistory.items))
        .order_by(OrderHistory.created_at.desc())
    )
    if date_filter:
        stmt = stmt.where(func.date(OrderHistory.created_at) == date_filter)
    result = await db.execute(stmt)
    return list(result.scalars().all())
