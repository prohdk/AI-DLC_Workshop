from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    display_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    display_order: int | None = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    display_order: int

    model_config = {"from_attributes": True}


class MenuItemCreate(BaseModel):
    category_id: int
    name: str = Field(..., min_length=1, max_length=100)
    price: int = Field(..., ge=0)
    description: str | None = None
    image_url: str | None = None
    display_order: int = 0
    is_available: bool = True


class MenuItemUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    price: int | None = Field(None, ge=0)
    description: str | None = None
    image_url: str | None = None
    display_order: int | None = None
    is_available: bool | None = None


class MenuItemResponse(BaseModel):
    id: int
    category_id: int
    name: str
    price: int
    description: str | None
    image_url: str | None
    display_order: int
    is_available: bool

    model_config = {"from_attributes": True}


class MenuOrderUpdate(BaseModel):
    menu_item_id: int
    display_order: int
