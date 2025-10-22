# Cron Jobs

Cron jobs are scheduled background tasks that run at specified intervals using cron expressions.

## TickerFunction Attribute

Use the `[TickerFunction]` attribute to mark methods as scheduled jobs:

```csharp
[TickerFunction("JobName", "cron-expression")]
public async Task YourJobMethod(CancellationToken cancellationToken)
{
    // Your job logic here
}
```

## Example: Auto-Reject Stale Requests

Here's a real example from our demo that auto-rejects approved requests after 3 minutes:

```csharp
public class BackgroundJobs(IRepository<RequestEntity> _requestRepository, IRepository<RequestLog> _logRepository, IRepository<Report> _reportRepository, ILogger<RequestEntity> logger)
{
    [TickerFunction("AutoReject", "*/30 * * * *")]
    public async Task RejectStaleApprovedRequests(CancellationToken cancellationToken)
    {
        // Get all approved requests that are older than 3 minutes
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
}
```

## Example: Report Generation

Another example that creates reports:

```csharp
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
```

## Cron Expression Syntax

TickerQ uses standard cron expressions:

| Field | Values | Special Characters |
|-------|--------|-------------------|
| Minute | 0-59 | `*` `,` `-` `/` |
| Hour | 0-23 | `*` `,` `-` `/` |
| Day | 1-31 | `*` `,` `-` `/` `?` `L` `W` |
| Month | 1-12 | `*` `,` `-` `/` |
| Day of Week | 0-7 | `*` `,` `-` `/` `?` `L` `#` |

### Common Patterns

```csharp
"*/30 * * * *"     // Every 30 seconds
"0 * * * *"        // Every hour
"0 0 * * *"        // Daily at midnight
"0 0 * * 1"        // Weekly on Monday
"0 0 1 * *"        // Monthly on the 1st
"0 9-17 * * 1-5"   // Every hour from 9 AM to 5 PM, Monday to Friday
```

## Primary Constructor Pattern

Use primary constructors for dependency injection:

```csharp
public class BackgroundJobs(
    IRepository<RequestEntity> _requestRepository, 
    IRepository<RequestLog> _logRepository, 
    IRepository<Report> _reportRepository, 
    ILogger<RequestEntity> logger)
{
    // Your job methods here
}
```

## TickerFunctionContext

For jobs that need access to context data:

```csharp
[TickerFunction("JobWithData", "*/1 * * * *")]
public async Task ProcessData(TickerFunctionContext<MyDataType> context, CancellationToken cancellationToken)
{
    var data = context.Request; // Access your typed data
    // Process the data
}
```

## Best Practices

1. **Use meaningful job names** that describe what the job does
2. **Handle exceptions** within your job methods
3. **Use CancellationToken** for cancellation support
4. **Log job execution** for monitoring and debugging
5. **Keep jobs lightweight** - avoid long-running operations
6. **Use dependency injection** for accessing services

## Service Registration

Register your job classes in `Program.cs`:

```csharp
builder.Services.AddScoped<BackgroundJobs>();
```

## Next Steps

Learn about [Time Jobs](/docs/time-jobs) for one-time scheduled tasks.
