# ScheduleLunch

Aplicación de reservas de almuerzo con autenticación, grupos multi-tenant, programación semanal y actividad en tiempo real.

## Stack

- **Backend:** .NET 10, ASP.NET Core, PostgreSQL, EF Core, SignalR, JWT
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, @microsoft/signalr

## Estructura del proyecto

```
ScheduleLunch/
├── schedule-lunch-back/   # API .NET 10 (Clean Architecture)
│   └── src/
│       ├── SL.Domain/         # Entidades, enums, interfaces de repositorios
│       ├── SL.Application/    # Servicios, DTOs, TokenService
│       ├── SL.Infrastructure/ # EF Core, repositorios, migraciones, ActivityHub
│       └── SL.Api/            # Controladores, Program.cs, Swagger
└── schedule-lunch-front/  # Frontend Next.js 16
    ├── app/
    │   ├── setup/         # Configuración inicial (primer SuperAdmin)
    │   ├── (auth)/        # Login, Registro
    │   ├── (user)/        # Horario semanal, página de espera
    │   └── admin/         # Gestión de usuarios, grupos y slots
    └── lib/               # API client, auth helpers, SignalR, tipos
```

## Requisitos

- .NET 10 SDK
- Node.js 20+
- PostgreSQL 15+

## Configuración

### Backend

1. Ajustar la cadena de conexión y la clave JWT en `schedule-lunch-back/src/SL.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=localhost;Port=5432;Database=schedule_lunch_db;Username=postgres;Password=..."
  },
  "Jwt": {
    "Key": "tu-clave-secreta-aqui"
  }
}
```

2. Aplicar la migración de base de datos:

```bash
cd schedule-lunch-back/src/SL.Infrastructure
dotnet ef database update --startup-project ../SL.Api
```

3. Ejecutar la API:

```bash
cd schedule-lunch-back
dotnet run --project src/SL.Api
# http://localhost:5133 — Swagger en /swagger
```

### Frontend

1. Crear `schedule-lunch-front/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5133
JWT_SECRET=<misma clave que Jwt:Key del backend>
```

2. Instalar dependencias y ejecutar:

```bash
cd schedule-lunch-front
npm install
npm run dev
# http://localhost:3000
```

## Comandos útiles

```bash
# Backend — desde schedule-lunch-back/
dotnet build                    # Compilar
dotnet test tests/SL.Tests/     # Ejecutar tests
dotnet run --project src/SL.Api # Iniciar API

# Nueva migración
cd src/SL.Infrastructure
dotnet ef migrations add <Nombre> --startup-project ../SL.Api
dotnet ef database update --startup-project ../SL.Api
```

## API

| Controlador | Ruta base | Descripción |
|---|---|---|
| Setup | `/api/setup` | Configuración inicial — estado y creación del primer SuperAdmin |
| Auth | `/api/auth` | Registro, login, perfil (`/me`) |
| Groups | `/api/groups` | Grupos del usuario, solicitar unirse, aprobar miembros |
| Schedule | `/api/schedule` | Slots semanales, reservas, gestión de slots |
| Admin | `/api/admin` | Gestión de usuarios y grupos (SuperAdmin) |
| ActivityHub | `/hubs/activity` | SignalR — eventos en tiempo real por grupo |

## Roles

| Rol | Permisos |
|---|---|
| `User` | Ver horario, reservar/cancelar slots |
| `GroupAdmin` | Todo de User + crear/eliminar slots, aprobar miembros |
| `SuperAdmin` | Todo + gestión global de usuarios y grupos |

## Primera ejecución

La base de datos arranca vacía — sin usuarios. Al abrir la app por primera vez:

1. El frontend detecta que no hay ningún `SuperAdmin` (`GET /api/setup/status`)
2. Redirige automáticamente a `/setup`
3. Se llena el formulario con los datos del administrador
4. Se crea el `SuperAdmin` y redirige a `/login`

Una vez completado el setup, `/setup` queda bloqueada para todos.

## Flujo de usuario

1. `SuperAdmin` crea grupos desde `/admin/groups`
2. Usuario se registra → estado `Pending`
3. `GroupAdmin` aprueba desde `/admin/users` → estado `Approved`
4. Usuario inicia sesión → JWT con `role` y `groupId`
5. Reserva slots en la vista semanal
6. Cambios se reflejan en tiempo real vía SignalR para todos los miembros del grupo
