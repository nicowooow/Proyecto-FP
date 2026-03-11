# ===== ETAPA 1: Construcción (Build) =====
FROM node:20-alpine as build

WORKDIR /app

RUN npm install -g pnpm

# Copiar configuración e instalar dependencias
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Copiar el código fuente y compilar la aplicación React/Vite
COPY . .
RUN pnpm run build

# ===== ETAPA 2: Servidor Web (Nginx) =====
FROM nginx:alpine

# Copiar la build generada en la etapa anterior a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# La configuración por defecto de Nginx en Alpine a veces necesita ajustarse para React/React-Router
# Añadimos un conf personalizado para React-Router y el proxy hacia el backend
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /yourtree/api/ { \
        proxy_pass http://backend:3000; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (el puerto web por defecto de Nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
