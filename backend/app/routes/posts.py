from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..deps import get_db
from ..auth.security import get_current_user

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post(
    "/", 
    response_model=schemas.PostRead, 
    status_code=status.HTTP_201_CREATED
)
def create_post(
    post_in: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = models.Post(
        title=post_in.title,
        content=post_in.content,
        owner_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return schemas.PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        publication_date=post.publication_date,
        author_email=current_user.email,
    )

@router.get("/", response_model=List[schemas.PostRead])
def read_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return [
        schemas.PostRead(
            id=p.id,
            title=p.title,
            content=p.content,
            publication_date=p.publication_date,
            author_email=p.owner.email,
        )
        for p in posts
    ]

@router.get("/{post_id}", response_model=schemas.PostRead)
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return schemas.PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        publication_date=post.publication_date,
        author_email=post.owner.email,
    )

@router.put("/{post_id}", response_model=schemas.PostRead)
def update_post(
    post_id: int,
    post_in: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    post.title = post_in.title
    post.content = post_in.content
    db.commit()
    db.refresh(post)
    return schemas.PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        publication_date=post.publication_date,
        author_email=current_user.email,
    )

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(post)
    db.commit()
