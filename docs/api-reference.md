# API Reference

Complete code examples and implementation patterns for TickerQ integration.

## Service Registration

### Program.cs Setup

```csharp
using Application.Interfaces;
using Application.Jobs;
using Application.Services;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
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

// Repository DI
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Services DI
builder.Services.AddScoped<RequestService>();
builder.Services.AddScoped<BackgroundJobs>();
builder.Services.AddScoped<JobWithData>();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

// Enable TickerQ with Dashboard
app.UseTickerQ(qStartMode: TickerQ.Utilities.Enums.TickerQStartMode.Immediate);

app.MapControllers();
app.Run();
```

## Job Classes

### Background Jobs with Cron Scheduling

```csharp
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.Extensions.Logging;
using TickerQ.Utilities.Base;
using TickerQ.Utilities.Models;

namespace Application.Jobs;

public class BackgroundJobs(
    IRepository<RequestEntity> _requestRepository, 
    IRepository<RequestLog> _logRepository, 
    IRepository<Report> _reportRepository, 
    ILogger<RequestEntity> logger)
{
    [TickerFunction("AutoReject", "*/30 * * * *")]
    public async Task RejectStaleApprovedRequests(CancellationToken cancellationToken)
    {
        var threeMinutesAgo = DateTime.UtcNow.AddMinutes(-3);
        var staleApprovedRequests = await _requestRepository.GetAllAsync(r =>
            r.Status == RequestStatus.Approved &&
            r.ApprovedAt.HasValue &&
            r.ApprovedAt.Value < threeMinutesAgo);
        
        Console.WriteLine("The Background Job is running //////////////////////////////////////");
        
        foreach (var request in staleApprovedRequests)
        {
            try
            {
                await UpdateRequestStatus(request.Id, RequestStatus.Rejected, 
                    "Auto-rejected: Approved for more than 3 minutes without completion");
            }
            catch (Exception ex)
            {
                await LogError(request.Id, $"Error rejecting stale request: {ex.Message}");
            }
        }
    }

    [TickerFunction("CreateReport")]
    public async Task CreateReport(TickerFunctionContext tickerContext, CancellationToken cancellationToken)
    {
        var report = new Report
        {
            Title = $"Scheduled Report - {DateTime.UtcNow:yyyy-MM-dd HH:mm}",
            Content = $"This is an automatically generated report created at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}",
            CreatedAt = DateTime.UtcNow
        };

        await _reportRepository.AddAsync(report);
        await _reportRepository.SaveAsync();
        logger.LogInformation($"Report created with ID: {report.Id}");
    }

    private async Task UpdateRequestStatus(Guid requestId, RequestStatus newStatus, string reason)
    {
        var request = await _requestRepository.GetAsync(r => r.Id == requestId);
        if (request == null) return;

        request.Status = newStatus;
        
        switch (newStatus)
        {
            case RequestStatus.Approved: request.ApprovedAt = DateTime.UtcNow; break;
            case RequestStatus.Completed: request.CompletedAt = DateTime.UtcNow; break;
            case RequestStatus.Rejected: request.RejectedAt = DateTime.UtcNow; break;
        }

        _requestRepository.Update(request);

        var log = new RequestLog
        {
            RequestId = requestId,
            Action = $"Status changed to {newStatus}: {reason}"
        };
        await _logRepository.AddAsync(log);
        await _logRepository.SaveAsync();
    }

    private async Task LogError(Guid requestId, string errorMessage)
    {
        var log = new RequestLog
        {
            RequestId = requestId,
            Action = $"Error: {errorMessage}"
        };
        await _logRepository.AddAsync(log);
        await _logRepository.SaveAsync();
    }
}
```

### Time-based Jobs

```csharp
using System.Drawing;
using TickerQ.Utilities.Base;
using TickerQ.Utilities.Models;

namespace Application.Jobs;

public class JobWithData
{
    [TickerFunction("CleanUp")]
    public void CleanUp(TickerFunctionContext<Point> ticker)
    {
        Console.WriteLine($"X: {ticker.Request.X}, Y: {ticker.Request.Y}");
    }
}
```

## Exception Handler

```csharp
using TickerQ.Utilities.Base;
using TickerQ.Utilities.Enums;
using TickerQ.Utilities.Interfaces;

namespace TickerQ_Demo.Services;

public class TickerExceptionHandler(ILogger<TickerExceptionHandler> logger) : ITickerExceptionHandler
{
    public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
    {
        Console.WriteLine($"🚨 EXCEPTION - ID: {tickerId}, Type: {tickerType}, Error: {exception.Message}");
        logger.LogError(exception, "TickerQ job failed - ID: {TickerId}, Type: {TickerType}", tickerId, tickerType);
        await Task.CompletedTask;
    }

    public async Task HandleCanceledExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
    {
        Console.WriteLine($"⏹️ CANCELLED - ID: {tickerId}, Type: {tickerType}, Reason: {exception.Message}");
        logger.LogWarning("TickerQ job cancelled - ID: {TickerId}, Type: {TickerType}", tickerId, tickerType);
        await Task.CompletedTask;
    }
}
```

## API Controllers

### Scheduling Time Jobs

```csharp
using Application.DTOs;
using Application.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using TickerQ.Utilities;
using TickerQ.Utilities.Interfaces.Managers;
using TickerQ.Utilities.Models.Ticker;

namespace TickerQ_Demo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestsController(RequestService _service) : ControllerBase
{
    [HttpPost("Schedule")]
    public async Task<ActionResult> ScheduleBackgroundJobs(Point point, ITimeTickerManager<TimeTicker> manager)
    {
        await manager.AddAsync(new TimeTicker
        {
            Request = TickerHelper.CreateTickerRequest(point),
            ExecutionTime = DateTime.UtcNow.AddSeconds(10),
            Function = "CleanUp",
            Retries = 3,
            RetryIntervals = [1, 2, 3],
            Description = "Job with data example"
        });
        return Ok("Background job scheduled.");
    }
}
```

## Configuration Files

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=TickerQ;TrustServerCertificate=true;Integrated Security=SSPI"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "TickerQBasicAuth": {
    "username": "admin",
    "password": "admin"
  },
  "CronTicker": {
    "EveryMinute": "* * * * *"
  },
  "AllowedHosts": "*"
}
```

### Project File (.csproj)

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.10" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.10">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="9.0.6" />
    <PackageReference Include="TickerQ" Version="2.5.3" />
    <PackageReference Include="TickerQ.Dashboard" Version="2.5.3" />
    <PackageReference Include="TickerQ.EntityFrameworkCore" Version="2.5.3" />
  </ItemGroup>
</Project>
```

## Common Patterns

### Repository Pattern

```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null);
    Task AddAsync(T entity);
    void Update(T entity);
    Task SaveAsync();
}
```

### Service Registration

```csharp
// Repository DI
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Services DI
builder.Services.AddScoped<RequestService>();
builder.Services.AddScoped<BackgroundJobs>();
```

### Dependency Injection

```csharp
public class BackgroundJobs(
    IRepository<RequestEntity> _requestRepository, 
    IRepository<RequestLog> _logRepository, 
    IRepository<Report> _reportRepository, 
    ILogger<RequestEntity> logger)
{
    // Constructor parameters are automatically injected
}
```

## Best Practices Summary

1. **Use primary constructors** for dependency injection
2. **Register all job classes** in the DI container
3. **Handle exceptions** in job methods
4. **Use CancellationToken** for cancellation support
5. **Log job execution** for monitoring
6. **Configure appropriate retry strategies**
7. **Use meaningful job names** and descriptions
8. **Test exception scenarios** thoroughly
9. **Monitor job performance** via dashboard
10. **Keep jobs lightweight** and focused
