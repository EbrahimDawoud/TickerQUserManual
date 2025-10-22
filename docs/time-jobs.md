# Time Jobs

Time jobs are one-time scheduled tasks that execute at a specific time in the future.

## ITimeTickerManager

Use `ITimeTickerManager<TimeTicker>` to schedule one-time jobs:

```csharp
public class RequestsController(RequestService _service)
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

## TimeTicker Properties

| Property | Type | Description |
|----------|------|-------------|
| `Request` | `object` | Data to pass to the job |
| `ExecutionTime` | `DateTime` | When to execute the job |
| `Function` | `string` | Name of the method to execute |
| `Retries` | `int` | Number of retry attempts |
| `RetryIntervals` | `int[]` | Delay between retries in seconds |
| `Description` | `string` | Human-readable description |

## Example: CleanUp Job

Here's a simple job that processes data:

```csharp
public class JobWithData
{
    [TickerFunction("CleanUp")]
    public void CleanUp(TickerFunctionContext<Point> ticker)
    {
        Console.WriteLine($"X: {ticker.Request.X}, Y: {ticker.Request.Y}");
    }
}
```

## Scheduling Jobs via API

### Basic Scheduling

```csharp
[HttpPost("Schedule")]
public async Task<ActionResult> ScheduleJob(ITimeTickerManager<TimeTicker> manager)
{
    await manager.AddAsync(new TimeTicker
    {
        Request = TickerHelper.CreateTickerRequest(new { message = "Hello World" }),
        ExecutionTime = DateTime.UtcNow.AddMinutes(5),
        Function = "ProcessMessage",
        Retries = 2,
        RetryIntervals = [30, 60],
        Description = "Process message in 5 minutes"
    });
    
    return Ok("Job scheduled successfully");
}
```

### With Custom Data

```csharp
[HttpPost("ScheduleWithData")]
public async Task<ActionResult> ScheduleWithData(MyDataModel data, ITimeTickerManager<TimeTicker> manager)
{
    await manager.AddAsync(new TimeTicker
    {
        Request = TickerHelper.CreateTickerRequest(data),
        ExecutionTime = DateTime.UtcNow.AddHours(1),
        Function = "ProcessData",
        Retries = 3,
        RetryIntervals = [1, 5, 15],
        Description = $"Process data: {data.Id}"
    });
    
    return Ok($"Job scheduled for {data.Id}");
}
```

## TickerFunctionContext

Access typed data in your job methods:

```csharp
[TickerFunction("ProcessData")]
public async Task ProcessData(TickerFunctionContext<MyDataModel> context, CancellationToken cancellationToken)
{
    var data = context.Request; // Strongly typed data
    var cancellationToken = context.CancellationToken;
    
    // Process the data
    await ProcessAsync(data);
}
```

## Retry Configuration

### Retry Attempts
```csharp
Retries = 3, // Will retry up to 3 times on failure
```

### Retry Intervals
```csharp
RetryIntervals = [1, 2, 3], // Wait 1s, then 2s, then 3s between retries
```

### No Retries
```csharp
Retries = 0, // No retries - fail immediately
RetryIntervals = [], // Empty array
```

## Execution Time Examples

```csharp
// Execute in 10 seconds
ExecutionTime = DateTime.UtcNow.AddSeconds(10)

// Execute in 5 minutes
ExecutionTime = DateTime.UtcNow.AddMinutes(5)

// Execute in 1 hour
ExecutionTime = DateTime.UtcNow.AddHours(1)

// Execute at specific time
ExecutionTime = new DateTime(2024, 12, 25, 10, 0, 0) // Christmas at 10 AM
```

## Job Lifecycle

1. **Scheduled** - Job is added to the queue
2. **Pending** - Waiting for execution time
3. **Running** - Currently executing
4. **Completed** - Successfully finished
5. **Failed** - Failed after all retries
6. **Cancelled** - Manually cancelled

## Monitoring Jobs

View scheduled jobs in the TickerQ Dashboard:

- Navigate to `/dashboard`
- Login with credentials from `appsettings.json`
- View job status and execution history
- Monitor retry attempts and failures

## Best Practices

1. **Use meaningful descriptions** for easy identification
2. **Set appropriate retry counts** based on job criticality
3. **Handle exceptions** in your job methods
4. **Use CancellationToken** for cancellation support
5. **Log job execution** for debugging
6. **Clean up resources** in finally blocks

## Next Steps

Learn about [Exception Handling](/docs/exception-handling) for managing job failures.
