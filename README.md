# Constellation

A .NET 8 web API application.

## Project Structure

```
src/
  Constellation.Api/         → Web API entry point
  Constellation.Services/    → Business logic
  Constellation.Data/        → Data access layer
  Constellation.Models/      → Shared domain models
tests/
  Constellation.Tests/       → Unit tests
docs/
  specs/                     → Specifications
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Getting Started

```bash
# Restore dependencies
dotnet restore

# Build
dotnet build

# Run the API
dotnet run --project src/Constellation.Api

# Run tests
dotnet test
```

## API Documentation

Swagger UI is available at `/swagger` when running in development mode.
