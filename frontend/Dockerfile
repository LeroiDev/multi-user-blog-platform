FROM node:20-slim

WORKDIR /app

# 1. copy only the manifests, install all deps (including dev & optional)
COPY package.json package-lock.json ./
RUN npm ci

# 2. copy the rest of your source & build
COPY . ./
RUN npm run build

# 3. install a static server & expose
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
