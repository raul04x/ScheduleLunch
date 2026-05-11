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
- PostgreSQL 17+

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

| Controller  | Base route                     | Description                                       |
| ----------- | ------------------------------ | ------------------------------------------------- |
| Setup       | `/sch-lunch-api/setup`         | First-time setup — status and SuperAdmin creation |
| Auth        | `/sch-lunch-api/auth`          | Register, login, profile (`/me`)                  |
| Groups      | `/sch-lunch-api/groups`        | User groups, member approval and removal          |
| Schedule    | `/sch-lunch-api/schedule`      | Weekly slots, reservations, slot management       |
| Admin       | `/sch-lunch-api/admin`         | User and group management (SuperAdmin)            |
| ActivityHub | `/sch-lunch-api/hubs/activity` | SignalR — real-time events per group              |

## Roles

| Role         | Permissions                                                      |
| ------------ | ---------------------------------------------------------------- |
| `User`       | View schedule, reserve/cancel slots                              |
| `GroupAdmin` | Everything in User + create/delete slots, approve/reject members |
| `SuperAdmin` | Everything + global user and group management, role assignment   |

## First-Time Admin Setup

The database starts empty — no users or groups exist. When opening the app for the first time:

1. The frontend detects that no `SuperAdmin` exists (`GET /sch-lunch-api/setup/status`)
2. Automatically redirects to `/setup`
3. Fill in the SuperAdmin credentials (username, email, password)
4. The account is created with `SuperAdmin` role, a default group is also created, and the page redirects to `/login`

Once setup is complete, `/setup` is blocked for all authenticated users.

### After Setup

Before inviting other users, the SuperAdmin should:

1. **Verify or rename the default group** — go to `/admin/groups` and edit the group created during setup
2. **Create lunch time slots** — go to `/admin/slots` and add the available time slots for the week
3. **Invite or inform users** — share the app URL so they can register

## User Flow

1. User registers → automatically placed in `Pending` status in the group
2. `GroupAdmin` or `SuperAdmin` sees the pending request in real time on `/admin/users` (via SignalR) and approves or rejects it
3. Approved user logs in → JWT includes `role` and `groupId`
4. User views the weekly schedule and reserves available slots
5. All group members see reservations and cancellations in real time via SignalR

## Real-Time Events (SignalR)

All events are scoped to the user's group channel (`group-{groupId}`):

| Event                 | Triggered when                                       |
| --------------------- | ---------------------------------------------------- |
| `UserPendingApproval` | A new user registers and is placed in Pending status |
| `UserReserved`        | A group member reserves a lunch slot                 |
| `UserCancelled`       | A group member cancels a reservation                 |
| `SlotCreated`         | An admin creates a new time slot                     |
| `SlotDeleted`         | An admin deletes a time slot                         |
