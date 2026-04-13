# 1. Imagen base ligera de Node.js
FROM node:20-alpine

# 2. Crear carpeta de trabajo
WORKDIR /app

# 3. Habilitar corepack para usar pnpm (opcional) o instalar pnpm globalmente
RUN npm install -g pnpm

# 4. Copiar package.json y lockfile
COPY package.json pnpm-lock.yaml* ./

# 5. Instalar dependencias
RUN pnpm install

# 6. Copiar el código del backend dentro del contenedor
COPY . .

# 7. Exponer el puerto interno donde correrá Express (por ejemplo 3000)
# Ajusta esto si tu ND_PORT es distinto en tu .env
EXPOSE 3000

# 8. Comando por defecto para producción
CMD ["node", "index.js"]
