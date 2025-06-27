from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite URL; the file will be created in the repo root
SQLALCHEMY_DATABASE_URL = "sqlite:///./blog.db"

# connect_args required for SQLite + multithreading
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal class will be our session factory
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)

# Base class for our ORM models
Base = declarative_base()
