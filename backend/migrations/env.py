from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.database import Base

# Alembic Config object, giving access to values from alembic.ini
config = context.config

# Override the URL from the environment (Docker Compose sets DATABASE_URL)
db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise RuntimeError("DATABASE_URL environment variable not set")
config.set_main_option("sqlalchemy.url", db_url)

# Set up Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Provide our MetaData for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations without a DB connection (“offline”)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations with a live DB connection (“online”)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

# Choose mode based on context
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
