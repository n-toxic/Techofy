FROM node:22-alpine AS builder

WORKDIR /app

# 1. Sabhi package.json files copy karo (taaki caching achhi mile)
COPY frontend/package.json ./frontend/
COPY shared/api-client/package.json ./shared/api-client/
COPY shared/api-zod/package.json ./shared/api-zod/
COPY shared/db/package.json ./shared/db/

# 2. Shared dependencies install karo
RUN cd shared/api-client && npm install
RUN cd shared/api-zod && npm install
RUN cd shared/db && npm install

# 3. Frontend dependencies install karo
RUN cd frontend && npm install --legacy-peer-deps

# 4. Ab saara source code copy karo
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# 5. Build frontend
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
