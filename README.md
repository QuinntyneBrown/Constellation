# Constellation

Constellation is a .NET 8 platform that discovers networking events and meetups where Black professionals in the space and defense industry are likely to attend or speak. It mines data from sources like Eventbrite, Meetup.com, and general web search, then exposes the results through a RESTful API.

## Project Structure

```
src/
  Constellation.Api/         → ASP.NET Core Web API (controllers, Swagger)
  Constellation.Services/    → Business logic and data mining
  Constellation.Data/        → Entity Framework Core / SQL Server data access
  Constellation.Models/      → Shared domain models
  Constellation.Web/         → Angular frontend (standalone SPA)
tests/
  Constellation.Tests/       → Unit tests (.NET)
  Constellation.Web/e2e/     → End-to-end tests (Playwright)
docs/
  specs/                     → Requirements and specifications
  ui-design.pen              → UI design file
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (for the Angular frontend)
- SQL Server (local or remote)

## Getting Started

### API (backend)

```bash
# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Run the API
dotnet run --project src/Constellation.Api

# Run .NET tests
dotnet test
```

### Web (frontend)

```bash
cd src/Constellation.Web

# Install dependencies
npm install

# Start the dev server
npm start

# Run unit tests
npm test
```

## API Documentation

Swagger UI is available at `/swagger` when running in development mode.

## License

This project is proprietary. All rights reserved.
