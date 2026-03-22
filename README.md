# Constellation

Constellation is a .NET 8 platform that discovers networking events and meetups where Black professionals in the space and defense industry are likely to attend or speak. It mines data from sources like Eventbrite, Meetup.com, and general web search, then exposes the results through a RESTful API.

## Project Structure

```
src/
  Constellation.Api/         → ASP.NET Core Web API (controllers, Swagger)
  Constellation.Services/    → Business logic and data mining
  Constellation.Data/        → Entity Framework Core / SQL Server data access
  Constellation.Models/      → Shared domain models
tests/
  Constellation.Tests/       → Unit tests
docs/
  specs/                     → Requirements and specifications
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (local or remote)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-org>/Constellation.git
cd Constellation

# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Run the API
dotnet run --project src/Constellation.Api

# Run tests
dotnet test
```

## API Documentation

Swagger UI is available at `/swagger` when running in development mode.

## License

This project is proprietary. All rights reserved.
