# Hotel Booking API

API REST para la gestión de hoteles, habitaciones, usuarios y reservas.

## Tecnologías

- NestJS 11
- TypeScript
- PostgreSQL 15
- Prisma ORM
- JWT / Passport
- bcrypt
- Docker
- Swagger / OpenAPI
- class-validator

## Arquitectura

El proyecto utiliza **Clean Architecture**, organizado por módulos:

```
src/
├── auth/
├── users/
├── hotels/
├── rooms/
├── bookings/
└── shared/
```

Cada módulo se divide principalmente en:

- `domain/` → entidades y contratos de repositorios.
- `application/` → casos de uso y DTOs.
- `infrastructure/` → persistencia y servicios externos.
- `presentation/` → controllers, guards y decorators.

Los casos de uso dependen de abstracciones de repositorios y no directamente de Prisma.

## Modelo de datos

```
User
 └── Booking

Hotel
 └── Room
      └── Booking
```

- Un usuario puede tener múltiples reservas.
- Un hotel puede tener múltiples habitaciones.
- Una habitación pertenece a un único hotel.
- Una reserva pertenece a un usuario y a una habitación.

## Funcionalidades

La API permite:

- Registrar usuarios.
- Autenticar usuarios mediante JWT.
- Gestionar hoteles.
- Gestionar habitaciones.
- Consultar habitaciones disponibles.
- Crear reservas.
- Consultar las reservas del usuario autenticado.
- Cancelar reservas propias.
- Confirmar reservas como administrador.
- Controlar acceso mediante los roles `USER` y `ADMIN`.

## Requisitos

Antes de iniciar el proyecto necesitas tener instalado:

- Node.js
- npm
- Docker
- Docker Compose

## Instalación y desarrollo

### 1\. Instalar dependencias

```
npm install
```

### 2\. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```
DATABASE_URL="postgresql://postgres:123456@localhost:5432/hotel_booking"

JWT_SECRET="super-secret-key-change-me"

PORT=3000

POSTGRES_DB=hotel_booking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_PORT=5432
```

### 3\. Levantar PostgreSQL

```
docker compose up -d
```

Esto inicia PostgreSQL mediante Docker Compose.

### 4\. Generar el cliente de Prisma

```
npm run prisma:generate
```

### 5\. Ejecutar las migraciones

```
npm run prisma:migrate
```

Este comando crea y actualiza las tablas de la base de datos según `prisma/schema.prisma`.

### 6\. Ejecutar el seed

```
npm run seed
```

El seed crea datos iniciales para usuarios, hoteles, habitaciones y reservas.

Credenciales creadas por el seed:

```
Admin
email: admin@hotel.com
password: Admin1234

User
email: user@hotel.com
password: User1234
```

### 7\. Iniciar la API

```
npm run start:dev
```

La API estará disponible en:

```
http://localhost:3000/api
```

La documentación Swagger estará disponible en:

```
http://localhost:3000/docs
```

## Autenticación

Los endpoints protegidos utilizan JWT mediante el header:

```
Authorization: Bearer <JWT>
```

Existen dos roles:

```
USER
ADMIN
```

Los endpoints administrativos requieren autenticación y el rol `ADMIN`.

Los endpoints relacionados con las reservas requieren autenticación según la operación.

## Endpoints

La API utiliza `/api` como prefijo global.

### Users

| Método | Endpoint     | Acceso  |
| ------ | ------------ | ------- |
| POST   | `/api/users` | Público |

Registra un nuevo usuario.

### Auth

| Método | Endpoint          | Acceso  |
| ------ | ----------------- | ------- |
| POST   | `/api/auth/login` | Público |

Autentica un usuario y devuelve un JWT.

### Hotels

| Método | Endpoint          | Acceso  |
| ------ | ----------------- | ------- |
| GET    | `/api/hotels`     | Público |
| GET    | `/api/hotels/:id` | Público |
| POST   | `/api/hotels`     | ADMIN   |
| PATCH  | `/api/hotels/:id` | ADMIN   |
| DELETE | `/api/hotels/:id` | ADMIN   |

Permite consultar y administrar hoteles.

### Rooms

| Método | Endpoint                    | Acceso  |
| ------ | --------------------------- | ------- |
| GET    | `/api/rooms/hotel/:hotelId` | Público |
| GET    | `/api/rooms/available`      | Público |
| POST   | `/api/rooms`                | ADMIN   |
| PATCH  | `/api/rooms/:id`            | ADMIN   |
| DELETE | `/api/rooms/:id`            | ADMIN   |

Consulta de habitaciones disponibles:

```
GET /api/rooms/available?hotelId=1&checkIn=2026-10-10T14:00:00Z&checkOut=2026-10-15T11:00:00Z
```

### Bookings

| Método | Endpoint                    | Acceso      |
| ------ | --------------------------- | ----------- |
| POST   | `/api/bookings`             | Autenticado |
| GET    | `/api/bookings/me`          | Autenticado |
| PATCH  | `/api/bookings/:id/cancel`  | Propietario |
| PATCH  | `/api/bookings/:id/confirm` | ADMIN       |

## Lógica de negocio

### Creación de reservas

Al crear una reserva se validan las siguientes condiciones:

1. `checkIn` debe ser anterior a `checkOut`.
2. `checkIn` no puede estar en el pasado.
3. La habitación debe existir.
4. La habitación no puede tener otra reserva `PENDING` o `CONFIRMED` que se solape con las fechas solicitadas.
5. Una nueva reserva se crea inicialmente con estado `PENDING`.

### Estados de una reserva

```
PENDING
CONFIRMED
CANCELLED
```

Una reserva puede pasar de `PENDING` a `CONFIRMED` mediante un administrador.

Una reserva puede ser cancelada por su propietario.

Las reservas canceladas no pueden volver a confirmarse.

Antes de confirmar una reserva, el sistema verifica que la habitación continúe disponible para las fechas solicitadas.

## Roles y permisos

### USER

Un usuario autenticado puede:

- Crear reservas.
- Consultar sus propias reservas.
- Cancelar sus propias reservas.

No puede:

- Crear, modificar o eliminar hoteles.
- Crear, modificar o eliminar habitaciones.
- Confirmar reservas.
- Cancelar reservas pertenecientes a otros usuarios.

### ADMIN

Un administrador puede:

- Gestionar hoteles.
- Gestionar habitaciones.
- Confirmar reservas.
- Realizar las operaciones permitidas por los endpoints administrativos.

## Validaciones

La API utiliza un `ValidationPipe` global con:

```
{
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true
}
```

Los parámetros numéricos de las rutas se validan mediante `ParseIntPipe`.

Las fechas y datos enviados en las peticiones son validados mediante DTOs y `class-validator`.

## Manejo de errores

Los errores HTTP son gestionados mediante un filtro global.

Las respuestas de error utilizan una estructura como:

```
{
  "success": false,
  "statusCode": 404,
  "message": "Hotel not found",
  "path": "/api/hotels/10",
  "timestamp": "2026-10-01T00:00:00.000Z"
}
```

## Prisma

El esquema de la base de datos se encuentra en:

```
prisma/schema.prisma
```

Las migraciones se encuentran en:

```
prisma/migrations/
```

El seed se encuentra en:

```
prisma/seed.ts
```

El cliente de Prisma se genera mediante:

```
npm run prisma:generate
```

## Comandos principales

Instalar dependencias:

```
npm install
```

Levantar PostgreSQL:

```
docker compose up -d
```

Generar Prisma Client:

```
npm run prisma:generate
```

Crear/aplicar migraciones en desarrollo:

```
npm run prisma:migrate
```

Ejecutar datos iniciales:

```
npm run seed
```

Iniciar la aplicación en desarrollo:

```
npm run start:dev
```

Detener PostgreSQL:

```
docker compose down
```

## Flujo completo desde cero

Para levantar el proyecto por primera vez:

```
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

Después de iniciar la API:

```
API:
http://localhost:3000/api

Swagger:
http://localhost:3000/docs
```
