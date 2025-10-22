# Installation

This guide will walk you through setting up TickerQ in your .NET project.

## NuGet Packages

Add the following TickerQ packages to your project:

```xml
<PackageReference Include="TickerQ" Version="2.5.3" />
<PackageReference Include="TickerQ.EntityFrameworkCore" Version="2.5.3" />
<PackageReference Include="TickerQ.Dashboard" Version="2.5.3" />
```

Or via Package Manager Console:

```powershell
Install-Package TickerQ -Version 2.5.3
Install-Package TickerQ.EntityFrameworkCore -Version 2.5.3
Install-Package TickerQ.Dashboard -Version 2.5.3
```

## Database Configuration

### 1. Connection String

Add your SQL Server connection string to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=TickerQ;TrustServerCertificate=true;Integrated Security=SSPI"
  }
}
```

### 2. Entity Framework Setup

Configure your DbContext to include TickerQ's operational store:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 3. Database Migration

Create and apply a migration for TickerQ tables:

```bash
dotnet ef migrations add TickerQInitial
dotnet ef database update
```

## Project Structure

Ensure your project follows this structure:

```
YourProject/
├── Domain/
│   ├── Entities/
│   └── Enums/
├── Application/
│   ├── Services/
│   ├── Jobs/
│   └── Interfaces/
├── Infrastructure/
│   ├── Persistence/
│   └── Repositories/
└── YourProject/
    ├── Controllers/
    ├── Program.cs
    └── appsettings.json
```

## Dependencies

Make sure your project references:

- **Microsoft.EntityFrameworkCore.SqlServer** (9.0.10)
- **Microsoft.EntityFrameworkCore.Tools** (9.0.10)
- **System.Text.Json** (for serialization)

## Next Steps

Once you have the packages installed and database configured, proceed to the [Configuration](/docs/configuration) guide to set up TickerQ in your application.
