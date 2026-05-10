# ScheduleLunch

Lunch reservation app with authentication, multi-tenant groups, weekly scheduling, and real-time activity feed.

## Stack

- **Backend:** .NET 10, ASP.NET Core, PostgreSQL, EF Core, SignalR, JWT
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, @microsoft/signalr

## Project Structure

```
ScheduleLunch/
├── schedule-lunch-back/   # .NET 10 API (Clean Architecture)
│   └── src/
│       ├── SL.Domain/         # Entities, enums, repository interfaces
│       ├── SL.Application/    # Services, DTOs, TokenService
│       ├── SL.Infrastructure/ # EF Core, repositories, migrations, ActivityHub
│       └── SL.Api/            # Controllers, Program.cs, Swagger
└── schedule-lunch-front/  # Next.js 16 frontend
    ├── app/
    │   ├── setup/         # First-time setup (first SuperAdmin)
    │   ├── (auth)/        # Login, Register
    │   ├── (user)/        # Weekly schedule, pending page
    │   └── admin/         # User, group, and slot management
    └── lib/               # API client, auth helpers, SignalR, types
```

## Requirements

- .NET 10 SDK
- Node.js 20+
- PostgreSQL 15+

## Setup

### Backend

1. Set the connection string and JWT key in `schedule-lunch-back/src/SL.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=localhost;Port=5432;Database=schedule_lunch_db;Username=postgres;Password=..."
  },
  "Jwt": {
    "Key": "your-secret-key-here"
  }
}
```

2. Run the API (database is created and migrations applied automatically on startup):

```bash
cd schedule-lunch-back
dotnet run --project src/SL.Api
# http://localhost:5133 — Swagger at /swagger
```

### Frontend

1. Create `schedule-lunch-front/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5133
JWT_SECRET=<same value as Jwt:Key in the backend>
```

2. Install dependencies and run:

```bash
cd schedule-lunch-front
npm install
npm run dev
# http://localhost:3000
```

## Useful Commands

```bash
# Backend — from schedule-lunch-back/
dotnet build                    # Build
dotnet test tests/SL.Tests/     # Run tests
dotnet run --project src/SL.Api # Start API

# New migration
cd src/SL.Infrastructure
dotnet ef migrations add <Name> --startup-project ../SL.Api
dotnet ef database update --startup-project ../SL.Api
```

## API

| Controller | Base route | Description |
|---|---|---|
| Setup | `/api/setup` | First-time setup — status and SuperAdmin creation |
| Auth | `/api/auth` | Register, login, profile (`/me`) |
| Groups | `/api/groups` | User groups, join requests, member approval |
| Schedule | `/api/schedule` | Weekly slots, reservations, slot management |
| Admin | `/api/admin` | User and group management (SuperAdmin) |
| ActivityHub | `/hubs/activity` | SignalR — real-time events per group |

## Roles

| Role | Permissions |
|---|---|
| `User` | View schedule, reserve/cancel slots |
| `GroupAdmin` | Everything in User + create/delete slots, approve members |
| `SuperAdmin` | Everything + global user and group management |

## First Run

The database starts empty — no users. When opening the app for the first time:

1. The frontend checks if any `SuperAdmin` exists (`GET /api/setup/status`)
2. Automatically redirects to `/setup`
3. Fill in the administrator details
4. The `SuperAdmin` is created and redirected to `/login`

Once setup is complete, `/setup` is locked for everyone.

## User Flow

1. `SuperAdmin` creates groups from `/admin/groups`
2. User registers → status `Pending`
3. `GroupAdmin` approves from `/admin/users` → status `Approved`
4. User logs in → JWT with `role` and `groupId`
5. Reserves slots in the weekly schedule view
6. Changes are reflected in real time via SignalR for all group members
