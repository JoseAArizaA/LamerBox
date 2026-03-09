FROM php:8.2-fpm

# Instalamos dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Instalamos extensiones de PHP necesarias para Laravel y MariaDB
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalamos Composer (el gestor de paquetes de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www