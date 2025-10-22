# Configuration

This guide covers how to configure TickerQ in your .NET application.

## Basic Setup

### 1. Program.cs Configuration

Add TickerQ services to your `Program.cs`:

```csharp
using TickerQ.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
using TickerQ.Dashboard.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure TickerQ
builder.Services.AddTickerQ(options =>
{
    options.SetMaxConcurrency(4);
    options.AddOperationalStore<ApplicationDbContext>(efOpt =>
    {
        efOpt.UseModelCustomizerForMigrations();
    });
    options.AddDashboard(options =>
    {
        options.BasePath = "/dashboard";
        options.EnableBasicAuth = true;
    });
    options.SetExceptionHandler<TickerExceptionHandler>();
});

var app = builder.Build();

// Enable TickerQ middleware
app.UseTickerQ(qStartMode: TickerQ.Utilities.Enums.TickerQStartMode.Immediate);

app.Run();
```

### 2. Configuration Options

#### Max Concurrency
```csharp
options.SetMaxConcurrency(4); // Maximum 4 concurrent jobs
```

#### Operational Store
```csharp
options.AddOperationalStore<ApplicationDbContext>(efOpt =>
{
    efOpt.UseModelCustomizerForMigrations();
    // efOpt.CancelMissedTickersOnAppStart(); // Optional
});
```

#### Dashboard Configuration
```csharp
options.AddDashboard(options =>
{
    options.BasePath = "/dashboard";        // Dashboard URL path
    options.EnableBasicAuth = true;        // Enable authentication
});
```

#### Exception Handler
```csharp
options.SetExceptionHandler<TickerExceptionHandler>();
```

## appsettings.json Configuration

### Basic Authentication
```json
{
  "TickerQBasicAuth": {
    "username": "admin",
    "password": "admin"
  }
}
```

### Cron Expressions
```json
{
  "CronTicker": {
    "EveryMinute": "* * * * *"
  }
}
```

### Logging Configuration
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

## Service Registration

Register your job classes in the DI container:

```csharp
// Repository DI
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Services DI
builder.Services.AddScoped<RequestService>();
builder.Services.AddScoped<BackgroundJobs>();
builder.Services.AddScoped<JobWithData>();
```

## Middleware Order

Ensure TickerQ middleware is added in the correct order:

```csharp
var app = builder.Build();

// Other middleware
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

// TickerQ middleware
app.UseTickerQ(qStartMode: TickerQ.Utilities.Enums.TickerQStartMode.Immediate);

app.MapControllers();
```

## Start Modes

TickerQ supports different start modes:

- **Immediate**: Start processing jobs immediately
- **Delayed**: Start after a delay
- **Manual**: Start manually via API

```csharp
app.UseTickerQ(qStartMode: TickerQ.Utilities.Enums.TickerQStartMode.Immediate);
```

## Next Steps

Now that TickerQ is configured, learn about [Cron Jobs](/docs/cron-jobs) for scheduled background tasks.
