from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_admin, get_current_table
from app.database.connection import get_db
from app.database.models import Table
from app.order.schemas import OrderCreateRequest, OrderResponse, OrderStatusUpdateRequest
from app.order import service

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    body: OrderCreateRequest,
    token: dict = Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    table_id = int(token["sub"])
    items = [i.model_dump() for i in body.items]
    return await service.create_order(db, table_id, items)


@router.get("/session", response_model=list[OrderResponse])
async def get_session_orders(
    token: dict = Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    table_id = int(token["sub"])
    table = await db.get(Table, table_id)
    if not table or not table.current_session_id:
        return []
    return await service.get_orders_by_session(db, table.current_session_id)


@router.get("/table/{table_id}", response_model=list[OrderResponse])
async def get_table_orders(
    table_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_orders_by_table(db, table_id)


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_status(
    order_id: int,
    body: OrderStatusUpdateRequest,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.update_order_status(db, order_id, body.status)


@router.delete("/{order_id}", status_code=204)
async def delete_order(
    order_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await service.delete_order(db, order_id)
