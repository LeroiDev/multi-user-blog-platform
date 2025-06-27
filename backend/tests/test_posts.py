import pytest

@pytest.mark.asyncio
async def test_posts_crud(async_client):
    # Register & login user1
    res1 = await async_client.post(
        "/users/",
        json={"email": "user1@example.com", "password": "password"}
    )
    assert res1.status_code in (200, 201)

    login1 = await async_client.post(
        "/token",
        data={"username": "user1@example.com", "password": "password"}
    )
    assert login1.status_code == 200
    token1 = login1.json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Create post (owner)
    create = await async_client.post(
        "/posts/",
        json={"title": "t1", "content": "c1"},
        headers=headers1
    )
    assert create.status_code == 201
    post = create.json()
    post_id = post["id"]
    assert post["author_email"] == "user1@example.com"

    # Read all posts
    all_posts = await async_client.get("/posts/")
    assert all_posts.status_code == 200
    assert isinstance(all_posts.json(), list)

    # Read single post
    single = await async_client.get(f"/posts/{post_id}")
    assert single.status_code == 200
    assert single.json()["id"] == post_id

    # Update post (owner)
    updated = await async_client.put(
        f"/posts/{post_id}",
        json={"title": "t1u", "content": "c1u"},
        headers=headers1
    )
    assert updated.status_code == 200
    assert updated.json()["title"] == "t1u"

    # Register & login user2 (non-owner)
    res2 = await async_client.post(
        "/users/",
        json={"email": "user2@example.com", "password": "password"}
    )
    assert res2.status_code in (200, 201)

    login2 = await async_client.post(
        "/token",
        data={"username": "user2@example.com", "password": "password"}
    )
    assert login2.status_code == 200
    token2 = login2.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # Attempt update as non-owner → 403
    upd2 = await async_client.put(
        f"/posts/{post_id}",
        json={"title": "x", "content": "y"},
        headers=headers2
    )
    assert upd2.status_code == 403

    # Attempt delete as non-owner → 403
    del2 = await async_client.delete(
        f"/posts/{post_id}",
        headers=headers2
    )
    assert del2.status_code == 403

    # Delete as owner → 204
    del1 = await async_client.delete(
        f"/posts/{post_id}",
        headers=headers1
    )
    assert del1.status_code == 204

    # Read deleted post → 404
    missing = await async_client.get(f"/posts/{post_id}")
    assert missing.status_code == 404
