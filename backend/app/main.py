from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.config import settings
from app.database.connection import engine
from app.database.models import Base
from app.database.seed import seed_data
from app.database.connection import async_session
from app.menu.router import router as menu_router
from app.order.router import router as order_router
from app.sse.router import router as sse_router
from app.table.router import router as table_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as db:
        await seed_data(db)
    yield
    await engine.dispose()


app = FastAPI(title="Table Order API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(menu_router)
app.include_router(order_router)
app.include_router(table_router)
app.include_router(sse_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
