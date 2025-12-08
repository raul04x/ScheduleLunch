# Scheduler Lunch

## Installation

### Prerequisites

- .NET Core 3.1+ (Legacy)
- .NET 10
- Visual Studio or VS Code

### Setup

1. Clone the repository
2. Navigate to the project directory
3. Restore dependencies: `dotnet restore`
4. Build the project: `dotnet build`
5. Run the application: `dotnet run`

## API Endpoints

### Scheduler Controller

- `GET /scheduler` - Health check
- `GET /scheduler/GetConfigFile` - Retrieve configuration settings
- `POST /scheduler/SetConfigFile` - Update configuration settings
- `GET /scheduler/GetSchedule` - Fetch current lunch schedule
- `POST /scheduler/SetSchedule` - Create or update schedule
- `POST /scheduler/AddEather` - Add person to time slot
- `POST /scheduler/RemoveEather` - Remove person from time slot
- `POST /scheduler/ChangeEaterName` - Update person's name across schedule

## Features

- Real-time updates via SignalR Hub
- JSON-based configuration and schedule persistence
- Time slot management with capacity limits
- Dynamic schedule generation based on time intervals
