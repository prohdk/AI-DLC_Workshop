from datetime import datetime

from pydantic import BaseModel, Field

from app.database.models import OrderStatus


class OrderItemRequest(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., ge=1)


class OrderCreateRequest(BaseModel):
    items: list[OrderItemRequest] = Field(..., min_length=1)


class OrderStatusUpdateRequest(BaseModel):
    status: OrderStatus


class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    menu_name: str
    quantity: int
    unit_price: int

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    table_id: int
    session_id: int
    status: OrderStatus
    total_amount: int
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}
