# LamerBox

¡Bienvenido a **LamerBox**! Una plataforma web moderna y atractiva diseñada para los amantes del cine. Con LamerBox, los usuarios pueden buscar sus películas favoritas, gestionar listas personalizadas, marcar títulos como vistos, añadir a favoritos y dejar reseñas con puntuaciones. Además, cuenta con un completo sistema de roles con acceso a un panel de administración.

El proyecto está completamente contenedorizado mediante **Docker**, lo que garantiza que todo el entorno (Frontend, Backend y Base de Datos) se configure e instale automáticamente en cualquier ordenador en cuestión de minutos.

---

## Stack Tecnológico

* **Backend:** Laravel 11 (Configurado como API REST)
* **Frontend:** React + Vite (Single Page Application con diseño responsive y soporte multimedia)
* **Base de Datos:** MySQL
* **Contenedores:** Docker & Docker Compose
* **API de Terceros:** Integración nativa con The Movie Database (TMDB)

---

## Guía de Instalación Rápida (Entorno Local)

Siga estos sencillos pasos para clonar y desplegar la aplicación en su máquina local.

### Prerrequisitos

* Tener instalado **Git** en el equipo.
* Tener instalado **Docker Desktop** y asegurarse de **abrir la aplicación antes de ejecutar los comandos**.

---

### 1.-Clonar el repositorio y acceder al proyecto

```bash
git clone https://github.com/JoseAArizaA/LamerBox.git
```

### 2.-Configurar los archivos de entorno (`.env`)

#### Copiar configuración del Backend

cp backend/.env.example backend/.env

#### Copiar configuración del Frontend

cp frontend/.env.example frontend/.env

**Configuración de la API de Películas:** Para que el buscador de películas funcione, debe añadir sus propias credenciales de  **The Movie Database (TMDB)** .

* Regístrese de forma gratuita en [The Movie Database (TMDB)](https://www.themoviedb.org/signup).
* Solicite su clave de acceso en el apartado de configuración de su perfil de usuario (API section).
* Abra los archivos `.env` recién creados en su editor de código y rellene las variables correspondientes con sus claves generadas:
  * En `backend/.env`: Rellene `TMDB_API_KEY=` y `TMDB_TOKEN=`
  * En `frontend/.env`: Rellene `VITE_TMDB_API_KEY=`

### 3.-Construir y levantar la infraestructura con Docker Compose

**`docker-compose run --rm backend composer install`**

**`docker-compose up -d --build`**

### 4.-Inicializar la clave de seguridad de Laravel

`docker-compose exec backend php artisan key:generate`

### 5.-Preparar la Base de Datos y Seeds

Este paso creará la estructura de tablas limpia en la base de datos e insertará automáticamente el usuario administrador de pruebas:

`docker-compose exec backend php artisan migrate:fresh `

`docker-compose exec backend php artisan db:seed --class=AdminUserSeeder`

## Acceso a la Aplicación

Una vez completado el proceso, abra su navegador web preferido e introduzca la siguiente dirección:

**Aplicación Web:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

### Credenciales del Administrador

Para probar las herramientas de gestión, creación de listas y publicación de reseñas, inicie sesión en la interfaz web con la cuenta generada por el seeder:

* **Correo electrónico:** `admin@lamerbox.com`
* **Contraseña:** `123456`
