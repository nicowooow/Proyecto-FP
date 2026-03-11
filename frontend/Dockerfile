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

# Copiar la configuracion de nginx al servidor dentro del docker
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponer el puerto 80 y 443 (el puerto web por defecto de Nginx)
EXPOSE 80 433

CMD ["nginx", "-g", "daemon off;"]
