import sys, os
# Make sure 'backend/' is on sys.path so `import app.*` works
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Import your application and metadata
from app.database import Base
from app.deps import get_db
from app.main import app

# Use a shared in-memory SQLite database across all connections
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # ← ensures one in-memory DB for all sessions 
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def create_test_database():
    """
    Create all tables before each test, and drop them after.
    This runs automatically (autouse) so you never see "no such table" errors.
    """
    Base.metadata.create_all(bind=engine)  # creates tables in the shared in-memory DB :contentReference[oaicite:2]{index=2}
    yield
    Base.metadata.drop_all(bind=engine)

@pytest_asyncio.fixture
async def async_client():
    """
    Provide an AsyncClient for testing FastAPI.
    Overrides the get_db dependency so all routes use our in-memory session.
    """
    # Override get_db to return sessions from our test engine
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # Use ASGITransport instead of the removed `app=` parameter 
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

    app.dependency_overrides.clear()
