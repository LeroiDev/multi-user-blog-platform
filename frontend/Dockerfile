# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# 1. Copy only package manifests, install deps
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# 2. Copy all source code, build
COPY frontend/ ./
RUN npm run build

# 3. Install static server and serve
RUN npm install -g serve

EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
