FROM node:22-alpine AS builder

WORKDIR /app

# Frontend dependencies install
COPY frontend/package.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps

# Source copy karo
COPY frontend/ ./frontend/

# Build karo
RUN cd frontend && npm run build

# Production stage - nginx se serve karo
FROM nginx:alpine

# Built files copy karo
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# React Router ke liye nginx config (all routes index.html pe)
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
