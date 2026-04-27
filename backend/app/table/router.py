from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_admin
from app.database.connection import get_db
from app.table.schemas import (
    OrderHistoryResponse,
    TableResponse,
    TableSetupRequest,
    TableSummaryResponse,
)
from app.table import service

router = APIRouter(prefix="/api/tables", tags=["tables"])


@router.get("", response_model=list[TableResponse])
async def get_tables(
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.list_tables(db, store_id=1)


@router.post("", response_model=TableResponse, status_code=201)
async def setup_table(
    body: TableSetupRequest,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.setup_table(db, store_id=1, table_number=body.table_number, password=body.password)


@router.get("/{table_id}/summary", response_model=TableSummaryResponse)
async def get_table_summary(
    table_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_table_summary(db, table_id)


@router.post("/{table_id}/complete", status_code=204)
async def complete_session(
    table_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await service.complete_table_session(db, table_id)


@router.get("/{table_id}/history", response_model=list[OrderHistoryResponse])
async def get_history(
    table_id: int,
    date_filter: date | None = Query(None),
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_order_history(db, table_id, date_filter)
