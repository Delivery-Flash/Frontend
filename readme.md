
# DeliveryFlash - Frontend

Aplicación web de DeliveryFlash (Cliente y Repartidor), construida con **Vue 3**, **TypeScript**, **Vite**, **Pinia** y **Tailwind CSS**.

Este proyecto es uno de **3 repositorios** que conforman el sistema completo. Para tener todo funcionando localmente necesitas los 3:

| Repo | Qué es | URL |
|---|---|---|
| `data-base` | `docker-compose.yml` para levantar PostgreSQL | https://github.com/Delivery-Flash/data-base |
| `Backend` | API NestJS + Prisma (auth, pedidos, WebSocket) | https://github.com/Delivery-Flash/Backend |
| `Frontend` | Esta app (Vue) | https://github.com/Delivery-Flash/Frontend |

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Bundler / dev server | Vite |
| Lenguaje | TypeScript |
| Routing | Vue Router |
| Estado global | Pinia |
| Estilos | Tailwind CSS |
| Cliente HTTP | Axios |
| Tiempo real | socket.io-client |
| Linter / Formato | ESLint + Prettier |

---

## Requisitos previos

- **Node.js** v18 o superior → verifica con `node -v`
- **npm** (viene con Node.js) → verifica con `npm -v`
- **Docker** y **Docker Compose** → para levantar PostgreSQL (ver paso 1 abajo)

---

## Cómo levantar el proyecto completo (los 3 repos)

Clona los 3 repositorios como carpetas hermanas:

```bash
git clone https://github.com/Delivery-Flash/data-base.git
git clone https://github.com/Delivery-Flash/Backend.git
git clone https://github.com/Delivery-Flash/Frontend.git
```

### 1. Base de datos (`data-base/`)

```bash
cd data-base
docker compose up -d
```

Esto levanta PostgreSQL 16 en el puerto `5432` con la base `delivery_flash` (usuario/contraseña: `usuario`/`usuario`). Verifica que esté corriendo con `docker ps`.

### 2. Backend (`Backend/`)

Crea un archivo `.env` en la raíz del repo:

```env
DATABASE_URL="postgresql://usuario:usuario@localhost:5432/delivery_flash?schema=public"
PORT=3000
JWT_SECRET="cambia_esto_por_algo_seguro"
JWT_EXPIRES_IN="1d"
```

Luego:

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

### 3. Frontend (este repo)

Copia `.env.example` a `.env` (ya viene con los valores correctos para desarrollo local):

```bash
cp .env.example .env
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

> **Orden recomendado:** primero la base de datos, después el backend, y al final el frontend — cada uno depende del anterior.

---

## Primer uso (no hay usuarios de prueba)

La base de datos arranca vacía, no hay seed. Para probar la app:

1. Entra a `http://localhost:5173` → "Registrarme" → elige **Cliente** o **Repartidor** y completa el formulario.
2. Inicia sesión con ese correo y contraseña. Según el rol, te redirige a:
   - **Cliente** → `/client/home` (crear pedidos, ver historial, calificar al entregarse)
   - **Repartidor** → `/rider/board` (ver pedidos disponibles, aceptar, marcar entregado, ver historial y calificaciones)
3. Para probar el flujo completo necesitas al menos un usuario Cliente y uno Repartidor (puedes usar dos pestañas/navegadores distintos, uno logueado con cada rol).

---

## Conexión con el backend

La instancia de Axios (`src/services/api.ts`) y la conexión de WebSocket (`src/services/socket.service.ts`) toman la URL del backend desde las variables de entorno:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

El backend debe tener CORS habilitado para `http://localhost:5173` (ya viene configurado en `Backend/src/main.ts`).

---

## Estructura del proyecto

```
Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/          # Formularios y modales de login/registro
│   │   ├── client/        # RatingStars (calificar al repartidor)
│   │   └── rider/         # OrderCard (tarjeta de pedido disponible)
│   ├── views/
│   │   ├── auth/          # LoginView, RegisterClientView, RegisterRiderView
│   │   ├── client/        # ClientHomeView, CreateOrderView, OrderTrackingView
│   │   ├── rider/         # RiderBoardView
│   │   └── ProfileView.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── auth.store.ts      # Sesión (token, usuario)
│   │   └── orders.store.ts    # Pedidos del repartidor + WebSocket
│   ├── services/
│   │   ├── api.ts              # Instancia Axios (con interceptor JWT)
│   │   ├── socket.service.ts   # Conexión socket.io
│   │   ├── auth.service.ts
│   │   └── order.service.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── order.types.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Rutas implementadas

| Ruta | Vista | Rol | Descripción |
|---|---|---|---|
| `/` | `HommePageView.vue` | público | Landing page |
| `/login` | `LoginView.vue` | público | Inicio de sesión |
| `/register/client` | `RegisterClientView.vue` | público | Registro de cliente |
| `/register/driver` | `RegisterRiderView.vue` | público | Registro de repartidor |
| `/client/home` | `ClientHomeView.vue` | CLIENT | Lista de mis pedidos + crear nuevo |
| `/client/orders/new` | `CreateOrderView.vue` | CLIENT | Formulario para solicitar un envío |
| `/client/orders/:id` | `OrderTrackingView.vue` | CLIENT | Seguimiento del pedido y calificación al entregarse |
| `/rider/board` | `RiderBoardView.vue` | RIDER | Pedidos disponibles, pedido activo e historial de entregas |
| `/profile` | `ProfileView.vue` | autenticado | Perfil básico (nombre, edad, correo, vehículo si es repartidor) |

Las rutas con rol se protegen en `router/index.ts` con un `beforeEach` que verifica sesión y rol contra el store de auth.

---

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (`http://localhost:5173`), con hot reload |
| `npm run build` | Compila la app para producción (genera carpeta `dist/`) |
| `npm run preview` | Sirve localmente el build de producción, para probarlo antes de desplegar |
| `npm run type-check` | Corre el chequeo de tipos con `vue-tsc` |
