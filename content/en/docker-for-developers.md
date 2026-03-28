---
title: "Docker for Developers: A Practical Guide"
description: "Stop the 'works on my machine' problem forever. Learn Docker from containers to Compose to production-ready multi-stage builds."
date: "2024-05-10"
author: "Soren Lindqvist"
tags: ["docker", "devops", "web-development", "productivity"]
slug: "docker-for-developers"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80"
readingTime: 12
---

## Why Docker Matters

Every developer has said "it works on my machine." Docker eliminates that phrase by packaging your application with everything it needs to run — OS libraries, runtime, dependencies — into a portable container.

### Your First Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### Multi-Stage Builds

Dramatically reduce image size by separating build and runtime:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose for Local Dev

```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Essential Commands

```bash
docker build -t myapp .          # Build image
docker run -p 3000:3000 myapp    # Run container
docker compose up -d             # Start all services
docker compose logs -f app       # Follow logs
docker exec -it myapp sh         # Shell into container
```

Docker is the single best investment you can make in your development workflow.
