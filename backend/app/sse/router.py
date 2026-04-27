import asyncio

from fastapi import APIRouter, Depends
from sse_starlette.sse import EventSourceResponse

from app.auth.dependencies import get_current_admin
from app.sse.service import sse_manager

router = APIRouter(prefix="/api/sse", tags=["sse"])


@router.get("/orders")
async def subscribe_orders(_=Depends(get_current_admin)):
    conn_id, queue = sse_manager.subscribe()

    async def event_generator():
        try:
            while True:
                try:
                    msg = await asyncio.wait_for(queue.get(), timeout=30.0)
                    yield msg
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": ""}
        except asyncio.CancelledError:
            pass
        finally:
            sse_manager.unsubscribe(conn_id)

    return EventSourceResponse(event_generator())
