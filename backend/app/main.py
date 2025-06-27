from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import engine, Base
from .auth.routes import router as auth_router
from .routes.posts import router as posts_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables at startup
    Base.metadata.create_all(bind=engine)
    yield
    # (Optional) Cleanup logic here

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(posts_router)

@app.get("/health")
def health():
    return {"status": "ok"}
