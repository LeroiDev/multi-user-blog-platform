import pytest

@pytest.mark.asyncio
async def test_register_and_login(async_client):
    # Register
    # Register (use the same password string as for login)
    res = await async_client.post(
        "/users/",
        json={"email": "user1@example.com", "password": "password"}
    )
    assert res.status_code in (200, 201)
    data = res.json()
    assert "id" in data and data["email"] == "user1@example.com"

    # Login
    res = await async_client.post(
        "/token",
        data={"username": "user1@example.com", "password": "password"}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data and data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_with_wrong_password(async_client):
    # First register normally
    await async_client.post(
        "/users/",
        json={"email": "badpw@example.com", "password": "password"}
    )
    # Then try to login with an incorrect password
    res = await async_client.post(
        "/token",
        data={"username": "badpw@example.com", "password": "wrong"}
    )
    assert res.status_code == 401
    data = res.json()
    assert data["detail"] == "Incorrect credentials"
