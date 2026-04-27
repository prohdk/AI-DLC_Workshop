from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.models import (
    ALLOWED_TRANSITIONS,
    MenuItem,
    Order,
    OrderItem,
    OrderStatus,
    Table,
    TableSession,
)
from app.sse.service import sse_manager


async def create_order(
    db: AsyncSession, table_id: int, items: list[dict]
) -> Order:
    table = await db.get(Table, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    # Auto-create session if none active
    if table.current_session_id is None:
        session = TableSession(table_id=table.id)
        db.add(session)
        await db.flush()
        table.current_session_id = session.id
    session_id = table.current_session_id

    # Build order items with price snapshots
    order_items = []
    total = 0
    for entry in items:
        mi = await db.get(MenuItem, entry["menu_item_id"])
        if not mi or not mi.is_available:
            raise HTTPException(status_code=400, detail=f"Menu item {entry['menu_item_id']} unavailable")
        oi = OrderItem(
            menu_item_id=mi.id,
            menu_name=mi.name,
            quantity=entry["quantity"],
            unit_price=mi.price,
        )
        total += mi.price * entry["quantity"]
        order_items.append(oi)

    order = Order(
        table_id=table.id,
        session_id=session_id,
        total_amount=total,
    )
    order.items = order_items
    db.add(order)
    await db.commit()
    await db.refresh(order, ["items"])

    await sse_manager.publish("new_order", {
        "order_id": order.id,
        "table_id": table.id,
        "table_number": table.table_number,
        "total_amount": total,
        "items": [{"menu_name": oi.menu_name, "quantity": oi.quantity, "unit_price": oi.unit_price} for oi in order.items],
        "created_at": order.created_at.isoformat(),
    })
    return order


async def get_orders_by_session(db: AsyncSession, session_id: int) -> list[Order]:
    result = await db.execute(
        select(Order)
        .where(Order.session_id == session_id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at)
    )
    return list(result.scalars().all())


async def get_orders_by_table(db: AsyncSession, table_id: int) -> list[Order]:
    table = await db.get(Table, table_id)
    if not table or not table.current_session_id:
        return []
    return await get_orders_by_session(db, table.current_session_id)


async def update_order_status(
    db: AsyncSession, order_id: int, new_status: OrderStatus
) -> Order:
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if new_status not in ALLOWED_TRANSITIONS.get(order.status, []):
        raise HTTPException(status_code=400, detail="Invalid status transition")

    old_status = order.status
    order.status = new_status
    await db.commit()
    await db.refresh(order)

    await sse_manager.publish("order_status_changed", {
        "order_id": order.id,
        "table_id": order.table_id,
        "old_status": old_status.value,
        "new_status": new_status.value,
    })
    return order


async def delete_order(db: AsyncSession, order_id: int) -> int:
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    table_id = order.table_id
    await db.delete(order)
    await db.commit()

    await sse_manager.publish("order_deleted", {
        "order_id": order_id,
        "table_id": table_id,
    })
    return table_id
