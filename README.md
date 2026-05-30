# Municipalidad de Yau — Sistema de Gestión de Trámites

Sistema integral para la gestión de trámites municipales con clasificación inteligente de urgencia (simulación de IA basada en palabras clave), arquitectura Single Page Application (SPA) y control de acceso basado en roles (RBAC).

## 🚀 Tecnologías Utilizadas

- **Frontend:** Vanilla JS, HTML5, Tailwind CSS (vía CDN), Arquitectura SPA (Single Page Application).
- **Backend:** Node.js, Express, JSON Web Tokens (JWT) para autenticación, Bcrypt para hashing de contraseñas.
- **Base de Datos:** MariaDB 10.4.
- **Infraestructura:** Docker y Docker Compose (con soporte para perfiles).

## 📂 Estructura del Proyecto

```text
proyecto_Yau/
├── backend/                # Código fuente del servidor Node.js
│   ├── public/             # Frontend estático (SPA servida por Express)
│   ├── src/                # Controladores, rutas y lógica de negocio
│   ├── package.json        # Dependencias de Node (pnpm)
│   └── Dockerfile          # Instrucciones para dockerizar el backend
├── DataBase/
│   └── db.sql              # Esquema de la base de datos y datos semilla (creación de tablas, usuarios)
└── docker-compose.yml      # Orquestación de contenedores (MariaDB y Backend)
```

## ⚙️ Guía de Ejecución

El proyecto está diseñado para ejecutarse en dos modalidades diferentes según tus necesidades:

### Modalidad 1: Desarrollo Local (Recomendado para programar)
En esta modalidad, la base de datos se ejecuta en Docker, pero el backend se ejecuta localmente usando `pnpm`. Esto permite recarga automática en caliente (hot-reload) de los archivos JS.

1. **Levantar solo la base de datos:**
   ```bash
   docker compose up -d
   ```
2. **Iniciar el servidor backend (en otra terminal):**
   ```bash
   cd backend
   pnpm install
   pnpm run dev
   ```
3. **Acceder al sistema:**
   Abre tu navegador en `http://localhost:3000`

### Modalidad 2: Fullstack Dockerizado (Para pruebas finales o despliegue)
En esta modalidad, **tanto la base de datos como el backend** se ejecutan dentro de contenedores Docker.

1. **Levantar todos los servicios:**
   ```bash
   docker compose --profile fullstack up -d --build
   ```
   *(El flag `--build` asegura que se compile cualquier cambio reciente en tu código).*

2. **Acceder al sistema:**
   Abre tu navegador en `http://localhost:3000`

3. **Para detener los contenedores:**
   ```bash
   docker compose --profile fullstack down
   ```

*Nota: Si necesitas resetear la base de datos a su estado original (borrar todos los registros creados y volver a cargar el archivo `db.sql`), ejecuta: `docker compose down -v`*

## 🔑 Credenciales de Prueba

El sistema incluye 3 usuarios preconfigurados en la base de datos. Todos usan la misma contraseña.

**Contraseña para todos los usuarios:** `123`

| Rol | Correo Electrónico | Nivel de Acceso |
|---|---|---|
| **Administrador** | `admin@yau.gob.pe` | Acceso total (incluye panel de gestión de empleados) |
| **Mesa de Partes** | `cruiz@yau.gob.pe` | Registro de ciudadanos, recepción de nuevos trámites |
| **Registrador Técnico**| `lgomez@yau.gob.pe` | Visualización de bandeja, pero permisos limitados |

> **Tip:** En la pantalla de Login, existen botones de acceso rápido (hints) en la parte inferior para autocompletar estas credenciales sin necesidad de escribirlas.

## 🤖 Sistema de Clasificación IA (Simulada)

El sistema analiza el `asunto` del trámite registrado. Si detecta palabras clave críticas como:
- **colapso**, **emergencia**, **riesgo**, **derrumbe**, **peligro**, **inundación**, **accidente**

Clasificará automáticamente el trámite como **Urgente** (🔴). De lo contrario, lo clasificará como **Normal** (🟡). Esta clasificación se refleja inmediatamente en la Bandeja y en el Monitor IA.
