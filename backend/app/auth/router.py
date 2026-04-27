from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import AdminLoginRequest, TableLoginRequest, TokenResponse
from app.auth.service import admin_login, table_login
from app.database.connection import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/admin/login", response_model=TokenResponse)
async def login_admin(body: AdminLoginRequest, db: AsyncSession = Depends(get_db)):
    token = await admin_login(db, body.store_identifier, body.username, body.password)
    return TokenResponse(access_token=token)


@router.post("/table/login", response_model=TokenResponse)
async def login_table(body: TableLoginRequest, db: AsyncSession = Depends(get_db)):
    token = await table_login(db, body.store_identifier, body.table_number, body.password)
    return TokenResponse(access_token=token)
