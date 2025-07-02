FROM python:3.11-slim

WORKDIR /app

# Install system deps for psycopg2
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Alembic config & migrations into the image
COPY backend/alembic.ini ./
COPY backend/migrations ./migrations

# Copy your FastAPI app
COPY backend/app ./app

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
