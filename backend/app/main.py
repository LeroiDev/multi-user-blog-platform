from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import engine, Base
from .auth.routes import router as auth_router
from .routes.posts import router as posts_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables at startup
    Base.metadata.create_all(bind=engine)
    yield
    # (Optional) Cleanup logic here

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="")
app.include_router(posts_router, prefix="")


@app.get("/health")
def health():
    return {"status": "ok"}
