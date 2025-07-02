import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env (if added later)
load_dotenv()

# Read DATABASE_URL from the environment, fall back to SQLite
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./blog.db"
)

# For SQLite only, enable check_same_thread
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Create the engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    **({"connect_args": connect_args} if connect_args else {})
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()
