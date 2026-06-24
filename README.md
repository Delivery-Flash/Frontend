
# DeliveryFlash - Frontend

Aplicación web del cliente para DeliveryFlash, construida con **Vue 3**, **TypeScript**, **Vite**, **Pinia** y **Tailwind CSS**.

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
| Linter / Formato | ESLint + Prettier |

---

## Requisitos previos

- **Node.js** v18 o superior → verifica con `node -v`
- **npm** (viene con Node.js) → verifica con `npm -v`
- El **backend de DeliveryFlash corriendo** en `http://localhost:3000` (ver el README del repositorio `Backend/`)
## Instalación desde cero

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd delivery-flash-fe

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

Si todo salió bien, la app está disponible en:

```
http://localhost:5173
```

> Antes de probar cualquier formulario (login, registro), asegúrate de tener el **backend corriendo** en `http://localhost:3000` — ver sección siguiente.

---

## Conexión con el backend

Este frontend se comunica con la API a través de una instancia de Axios configurada en `src/services/api.ts`, apuntando a:

```
http://localhost:3000
```

### Requisito: CORS habilitado en el backend

El backend (NestJS) debe tener CORS habilitado para aceptar peticiones desde `http://localhost:5173`. Esto ya debería estar configurado en `Backend/delivery-flash-be/src/main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```
### Orden recomendado para levantar el entorno completo

```bash
cd Backend/delivery-flash-be
npm run start:dev

cd Frontend/delivery-flash-fe
npm run dev
```

---

## Estructura del proyecto

```
delivery-flash-fe/
├── public/                      
├── src/
│   ├── assets/
│   │   └── main.css              
│   ├── components/               
│   │   └── auth/
│   ├── views/    # Aca van las vistas jsjs                 
│   │   └── auth/
│   ├── router/
│   │   └── index.ts              
│   ├── stores/                   
│   │   └── auth.store.ts         
│   ├── services/                 
│   │   ├── api.ts                
│   │   └── auth.service.ts       
│   ├── types/                    
│   │   └── auth.types.ts
│   ├── App.vue                   
│   └── main.ts                     
├── index.html
├── vite.config.ts   #plugin de Tailwind
├── tsconfig.json
└── package.json
```


## Rutas implementadas

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | — | Redirige a `/login` |
| `/login` | `LoginView.vue` | Formulario de inicio de sesión |
| `/register` | `RegisterChoiceView.vue` | Selección entre registro de Cliente o Repartidor |
| `/register/client` | `RegisterClientView.vue` | Formulario de registro de cliente |


---

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (`http://localhost:5173`), con hot reload |
| `npm run build` | Compila la app para producción (genera carpeta `dist/`) |
| `npm run preview` | Sirve localmente el build de producción, para probarlo antes de desplegar |
| `npm run lint` | Corre ESLint y corrige automáticamente lo que pueda |
| `npm run format` | Formatea el código con Prettier |

---
