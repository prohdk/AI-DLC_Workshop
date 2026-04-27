from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_admin, get_current_table
from app.database.connection import get_db
from app.menu.schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    MenuItemCreate,
    MenuItemResponse,
    MenuItemUpdate,
    MenuOrderUpdate,
)
from app.menu import service

router = APIRouter(prefix="/api/menu", tags=["menu"])


# --- Categories (public read, admin write) ---

@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(
    _=Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    # Table JWT provides store context; for single-store MVP, use store_id=1
    return await service.list_categories(db, store_id=1)


@router.get("/admin/categories", response_model=list[CategoryResponse])
async def admin_get_categories(
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.list_categories(db, store_id=1)


@router.post("/admin/categories", response_model=CategoryResponse, status_code=201)
async def create_category(
    body: CategoryCreate,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.create_category(db, store_id=1, name=body.name, display_order=body.display_order)


@router.patch("/admin/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    body: CategoryUpdate,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.update_category(db, category_id, **body.model_dump(exclude_unset=True))


@router.delete("/admin/categories/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await service.delete_category(db, category_id)


# --- Menu Items (public read, admin write) ---

@router.get("/items", response_model=list[MenuItemResponse])
async def get_menu_items(
    category_id: int | None = Query(None),
    _=Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    return await service.list_menu_items(db, category_id)


@router.get("/admin/items", response_model=list[MenuItemResponse])
async def admin_get_menu_items(
    category_id: int | None = Query(None),
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.list_menu_items(db, category_id)


@router.post("/admin/items", response_model=MenuItemResponse, status_code=201)
async def create_menu_item(
    body: MenuItemCreate,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.create_menu_item(db, **body.model_dump())


@router.patch("/admin/items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: int,
    body: MenuItemUpdate,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    return await service.update_menu_item(db, item_id, **body.model_dump(exclude_unset=True))


@router.delete("/admin/items/{item_id}", status_code=204)
async def delete_menu_item(
    item_id: int,
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await service.delete_menu_item(db, item_id)


@router.put("/admin/items/order", status_code=204)
async def reorder_menu_items(
    items: list[MenuOrderUpdate],
    _=Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await service.update_menu_order(db, [i.model_dump() for i in items])
