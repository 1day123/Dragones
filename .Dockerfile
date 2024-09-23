FROM php:8.0-fpm-alpine

WORKDIR /var/www/html

# Copiar archivos de Laravel
COPY . .

# Instalar dependencias de PHP
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo_mysql mysqli zip

RUN composer install

# Copiar archivos de React compilados
COPY ./build ./public

# Instalar Node.js y dependencias de frontend
RUN apk add --no-cache nodejs npm
WORKDIR /var/www/html/frontend
COPY package*.json ./
RUN npm install

# Generar archivos de producción (si es necesario)
RUN npm run build

# Exponer puertos
EXPOSE 80

# Comando para ejecutar la aplicación
CMD ["php-fpm"]
