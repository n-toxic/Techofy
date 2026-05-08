FROM node:22-alpine AS builder

WORKDIR /app

# 1. Sabhi package.json files copy karo (taaki caching achhi mile)
COPY package.json ./
COPY .npmrc ./
COPY frontend/package.json ./frontend/
COPY shared/api-client/package.json ./shared/api-client/
COPY shared/api-zod/package.json ./shared/api-zod/
COPY shared/db/package.json ./shared/db/

# 2. Root se ek baar install karo (npm deduplicate karega properly)
RUN npm install --legacy-peer-deps

# 3. Ab saara source code copy karo
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# 4. Build frontend
RUN cd frontend && npm run build

# --- Production Stage (Nginx) ---
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Nginx configuration for React/Vite Router
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
