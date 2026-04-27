from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Category, MenuItem


async def list_categories(db: AsyncSession, store_id: int) -> list[Category]:
    result = await db.execute(
        select(Category).where(Category.store_id == store_id).order_by(Category.display_order)
    )
    return list(result.scalars().all())


async def create_category(db: AsyncSession, store_id: int, name: str, display_order: int) -> Category:
    cat = Category(store_id=store_id, name=name, display_order=display_order)
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


async def update_category(db: AsyncSession, category_id: int, **kwargs) -> Category:
    cat = await db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for k, v in kwargs.items():
        if v is not None:
            setattr(cat, k, v)
    await db.commit()
    await db.refresh(cat)
    return cat


async def delete_category(db: AsyncSession, category_id: int) -> None:
    cat = await db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    result = await db.execute(
        select(MenuItem).where(MenuItem.category_id == category_id).limit(1)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Cannot delete category with menu items")
    await db.delete(cat)
    await db.commit()


async def list_menu_items(db: AsyncSession, category_id: int | None = None) -> list[MenuItem]:
    stmt = select(MenuItem).order_by(MenuItem.display_order)
    if category_id:
        stmt = stmt.where(MenuItem.category_id == category_id)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_menu_item(db: AsyncSession, **kwargs) -> MenuItem:
    item = MenuItem(**kwargs)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_menu_item(db: AsyncSession, item_id: int, **kwargs) -> MenuItem:
    item = await db.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    for k, v in kwargs.items():
        if v is not None:
            setattr(item, k, v)
    await db.commit()
    await db.refresh(item)
    return item


async def delete_menu_item(db: AsyncSession, item_id: int) -> None:
    item = await db.get(MenuItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    await db.delete(item)
    await db.commit()


async def update_menu_order(db: AsyncSession, items: list[dict]) -> None:
    for entry in items:
        item = await db.get(MenuItem, entry["menu_item_id"])
        if item:
            item.display_order = entry["display_order"]
    await db.commit()
