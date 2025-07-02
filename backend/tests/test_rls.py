import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app  # your FastAPI app
from app.database import Base, engine, SessionLocal
from alembic import command
from alembic.config import Config
import os

# Load test database (you’ll need a separate pytest.ini or override DATABASE_URL env var)
# e.g. postgresql://postgres:password@localhost:5432/blog_test
ALEMBIC_CFG = Config(os.path.join(os.path.dirname(__file__), "../alembic.ini"))

@pytest.fixture(scope="session", autouse=True)
def migrate_db():
    # Ensure the test database is clean
    Base.metadata.drop_all(bind=engine)
    # Run all migrations up to head
    command.upgrade(ALEMBIC_CFG, "head")
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.mark.asyncio
async def test_owner_can_crud_and_non_owner_blocked(monkeypatch):
    async with AsyncClient(
    transport=ASGITransport(app=app),
    base_url="http://test",) as client:
        # 1) Register two users
        r1 = await client.post("/users/", json={"email":"u1@example.com","password":"pass1"})
        assert r1.status_code == 200
        r2 = await client.post("/users/", json={"email":"u2@example.com","password":"pass2"})
        assert r2.status_code == 200

        # 2) Log in both
        tok1 = (await client.post(
            "/token",
            data={"username":"u1@example.com","password":"pass1"},
            headers={"Content-Type":"application/x-www-form-urlencoded"},
        )).json()["access_token"]
        tok2 = (await client.post(
            "/token",
            data={"username":"u2@example.com","password":"pass2"},
            headers={"Content-Type":"application/x-www-form-urlencoded"},
        )).json()["access_token"]

        headers1 = {"Authorization": f"Bearer {tok1}"}
        headers2 = {"Authorization": f"Bearer {tok2}"}

        # 3) Owner (u1) creates a post
        p = await client.post(
            "/posts/",
            json={"title":"Hello","content":"World"},
            headers=headers1,
        )
        assert p.status_code == 201
        post_id = p.json()["id"]

        # 4) Owner can update
        u = await client.put(
            f"/posts/{post_id}",
            json={"title":"New","content":"Content"},
            headers=headers1,
        )
        assert u.status_code == 200

        # 5) Non-owner cannot update or delete
        forbidden_update = await client.put(
            f"/posts/{post_id}",
            json={"title":"Haxx","content":"Nope"},
            headers=headers2,
        )
        assert forbidden_update.status_code == 403

        forbidden_delete = await client.delete(
            f"/posts/{post_id}",
            headers=headers2,
        )
        assert forbidden_delete.status_code == 403

        # 6) Owner can delete
        d = await client.delete(f"/posts/{post_id}", headers=headers1)
        assert d.status_code == 204
