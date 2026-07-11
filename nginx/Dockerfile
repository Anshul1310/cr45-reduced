FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend .
RUN npm run build

FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/ssl/server.crt /etc/nginx/ssl/server.crt
COPY nginx/ssl/server.key /etc/nginx/ssl/server.key

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]