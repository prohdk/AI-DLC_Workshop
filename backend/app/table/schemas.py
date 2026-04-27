from datetime import datetime

from pydantic import BaseModel, Field


class TableSetupRequest(BaseModel):
    table_number: int = Field(..., ge=1)
    password: str = Field(..., min_length=1, max_length=100)


class TableResponse(BaseModel):
    id: int
    table_number: int
    current_session_id: int | None

    model_config = {"from_attributes": True}


class TableSummaryResponse(BaseModel):
    id: int
    table_number: int
    current_session_id: int | None
    total_amount: int
    order_count: int


class OrderHistoryItemResponse(BaseModel):
    menu_name: str
    quantity: int
    unit_price: int

    model_config = {"from_attributes": True}


class OrderHistoryResponse(BaseModel):
    id: int
    order_number: int
    status: str
    total_amount: int
    created_at: datetime
    archived_at: datetime
    items: list[OrderHistoryItemResponse]

    model_config = {"from_attributes": True}
