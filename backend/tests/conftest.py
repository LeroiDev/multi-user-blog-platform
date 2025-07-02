import os
import sys

# 1. Ensure our backend package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# 2. Force alembic env.py to pick up SQLite in-memory for migrations
os.environ["DATABASE_URL"] = "sqlite://"

# 3. Patch alembic.command.upgrade to gracefully fallback on SQLite errors
from alembic import command as _alembic_command
from sqlalchemy.exc import OperationalError

_original_upgrade = _alembic_command.upgrade

def _patched_upgrade(config, revision):
    try:
        return _original_upgrade(config, revision)
    except OperationalError:
        # Fallback: for SQLite, just create all tables
        from app.database import Base, engine
        Base.metadata.create_all(bind=engine)

_alembic_command.upgrade = _patched_upgrade

# 4. Setup in-memory SQLite for tests
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Create/drop tables around each test
import pytest

from app.database import Base

@pytest.fixture(autouse=True)
def _create_and_drop_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# 6. Override get_db dependency
from app.deps import get_db as _real_get_db


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.main import app
app.dependency_overrides[_real_get_db] = _override_get_db

# 7. Override get_current_user to ignore SET LOCAL errors on SQLite
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from app.auth.security import oauth2_scheme, SECRET_KEY, ALGORITHM, get_current_user as _real_get_current_user
from app.models import User


def _override_get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(_override_get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    # attempt SET LOCAL; ignore on SQLite
    try:
        db.execute(text("SET LOCAL app.user_id = :uid"), {"uid": user.id})
    except OperationalError:
        pass

    return user

app.dependency_overrides[_real_get_current_user] = _override_get_current_user

# 8. Provide AsyncClient fixture
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
