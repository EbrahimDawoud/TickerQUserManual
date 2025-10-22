# Exception Handling

TickerQ provides a robust exception handling system that allows you to customize how job failures are managed.

## ITickerExceptionHandler Interface

Implement the `ITickerExceptionHandler` interface to handle job exceptions:

```csharp
using TickerQ.Utilities.Base;
using TickerQ.Utilities.Enums;
using TickerQ.Utilities.Interfaces;

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

## Handler Methods

### HandleExceptionAsync

Called when a job throws an exception:

```csharp
public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
{
    // Log the exception
    logger.LogError(exception, "Job {TickerId} of type {TickerType} failed", tickerId, tickerType);
    
    // Send notifications
    await SendFailureNotification(tickerId, exception);
    
    // Update database status
    await UpdateJobStatus(tickerId, JobStatus.Failed);
    
    // Custom business logic
    if (exception is DatabaseConnectionException)
    {
        await ScheduleRetry(tickerId);
    }
}
```

### HandleCanceledExceptionAsync

Called when a job is cancelled:

```csharp
public async Task HandleCanceledExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
{
    logger.LogWarning("Job {TickerId} was cancelled", tickerId);
    
    // Clean up resources
    await CleanupJobResources(tickerId);
    
    // Update status
    await UpdateJobStatus(tickerId, JobStatus.Cancelled);
}
```

## Registration

Register your exception handler in `Program.cs`:

```csharp
builder.Services.AddTickerQ(options =>
{
    // ... other options
    options.SetExceptionHandler<TickerExceptionHandler>();
});
```

## Advanced Exception Handling

### Custom Exception Types

Handle different exception types differently:

```csharp
public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
{
    switch (exception)
    {
        case DatabaseConnectionException dbEx:
            await HandleDatabaseException(dbEx, tickerId);
            break;
        case TimeoutException timeoutEx:
            await HandleTimeoutException(timeoutEx, tickerId);
            break;
        case ValidationException validationEx:
            await HandleValidationException(validationEx, tickerId);
            break;
        default:
            await HandleGenericException(exception, tickerId);
            break;
    }
}
```

### Notification System

Send notifications for critical failures:

```csharp
public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
{
    // Log the exception
    logger.LogError(exception, "Critical job failure: {TickerId}", tickerId);
    
    // Send email notification for critical jobs
    if (IsCriticalJob(tickerId))
    {
        await emailService.SendCriticalFailureAlert(tickerId, exception);
    }
    
    // Send Slack notification
    await slackService.SendJobFailureNotification(tickerId, exception.Message);
    
    // Create support ticket
    await supportService.CreateTicket(tickerId, exception);
}
```

### Retry Logic

Implement custom retry strategies:

```csharp
public async Task HandleExceptionAsync(Exception exception, Guid tickerId, TickerType tickerType)
{
    var retryCount = await GetRetryCount(tickerId);
    
    if (retryCount < MaxRetries && IsRetryableException(exception))
    {
        var delay = CalculateRetryDelay(retryCount);
        await ScheduleRetry(tickerId, delay);
    }
    else
    {
        await MarkJobAsFailed(tickerId);
    }
}

private bool IsRetryableException(Exception exception)
{
    return exception is DatabaseConnectionException ||
           exception is TimeoutException ||
           exception is HttpRequestException;
}

private TimeSpan CalculateRetryDelay(int retryCount)
{
    return TimeSpan.FromMinutes(Math.Pow(2, retryCount)); // Exponential backoff
}
```

## Testing Exception Handling

### Create Test Jobs

```csharp
[TickerFunction("TestException", "*/1 * * * *")]
public async Task TestException(TickerFunctionContext context, CancellationToken cancellationToken)
{
    Console.WriteLine($"💥 Exception test started at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}");
    await Task.Delay(1000, cancellationToken);
    throw new InvalidOperationException("Test exception for TickerQ exception handler!");
}
```

### Monitor in Dashboard

1. Navigate to `/dashboard`
2. View job execution history
3. Check exception details
4. Monitor retry attempts

## Best Practices

1. **Log all exceptions** with sufficient context
2. **Use structured logging** for better searchability
3. **Handle different exception types** appropriately
4. **Implement retry logic** for transient failures
5. **Send notifications** for critical failures
6. **Clean up resources** on cancellation
7. **Update job status** in your database
8. **Test exception scenarios** thoroughly

## Common Patterns

### Database Exception Handling
```csharp
if (exception is SqlException sqlEx)
{
    if (sqlEx.Number == 2) // Timeout
    {
        await ScheduleRetry(tickerId, TimeSpan.FromMinutes(5));
    }
    else if (sqlEx.Number == 1205) // Deadlock
    {
        await ScheduleRetry(tickerId, TimeSpan.FromSeconds(30));
    }
}
```

### HTTP Exception Handling
```csharp
if (exception is HttpRequestException httpEx)
{
    if (httpEx.Message.Contains("timeout"))
    {
        await ScheduleRetry(tickerId, TimeSpan.FromMinutes(2));
    }
}
```

## Next Steps

Learn about the [Dashboard](/docs/dashboard) for monitoring and managing your jobs.
