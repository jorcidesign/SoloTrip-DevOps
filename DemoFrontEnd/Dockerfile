# Etapa 1: Construcción
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx (Producción)
FROM nginx:alpine
COPY --from=build /app/dist/demo-front-end/browser /usr/share/nginx/html
# Configuración básica para que Angular funcione con Nginx
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
