# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm ci --only=production

# Copiar el resto de los archivos de la aplicación
COPY . .

# Crear directorio para logs si no existe
RUN mkdir -p LOG

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.mjs"] 