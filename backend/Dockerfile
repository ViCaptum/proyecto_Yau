# ================================================================
# Dockerfile — Backend + Frontend (estáticos en /public)
# Municipalidad de Yau
# ================================================================
FROM node:26-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar solo los archivos de dependencias primero (aprovecha cache de Docker)
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias de producción únicamente
RUN pnpm install --frozen-lockfile --prod

# Copiar el código fuente y el frontend estático
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 3000

CMD ["node", "src/app.js"]
