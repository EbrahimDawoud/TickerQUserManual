# Dashboard

The TickerQ Dashboard provides a web interface for monitoring and managing your background jobs.

## Accessing the Dashboard

Navigate to `/dashboard` in your browser:

```
https://localhost:5001/dashboard
```

## Authentication

The dashboard uses basic authentication. Configure credentials in `appsettings.json`:

```json
{
  "TickerQBasicAuth": {
    "username": "admin",
    "password": "admin"
  }
}
```

## Dashboard Features

### Job Monitoring

- **Real-time status** of all jobs
- **Execution history** with timestamps
- **Success/failure rates** and statistics
- **Performance metrics** and execution times

### Job Management

- **View scheduled jobs** (Cron and Time tickers)
- **Manual job execution** for testing
- **Job cancellation** for running jobs
- **Retry failed jobs** manually

### System Overview

- **Active job count** and queue status
- **System health** indicators
- **Resource usage** statistics
- **Error rates** and trends

## Dashboard Sections

### 1. Overview

The main dashboard shows:
- Total jobs executed
- Success/failure rates
- Active job count
- System performance metrics

### 2. Cron Tickers

View and manage scheduled jobs:
- Job name and description
- Cron expression
- Last execution time
- Next execution time
- Status (Active/Inactive)

### 3. Time Tickers

Monitor one-time jobs:
- Job details and data
- Execution time
- Status (Pending/Running/Completed/Failed)
- Retry information

### 4. Execution History

Detailed logs of job executions:
- Execution timestamp
- Job name and type
- Duration and status
- Error messages (if any)
- Retry attempts

## Configuration

### Dashboard Settings

Configure the dashboard in `Program.cs`:

```csharp
options.AddDashboard(options =>
{
    options.BasePath = "/dashboard";        // Dashboard URL path
    options.EnableBasicAuth = true;        // Enable authentication
});
```

### Custom Base Path

Change the dashboard URL:

```csharp
options.AddDashboard(options =>
{
    options.BasePath = "/admin/jobs";      // Custom path
    options.EnableBasicAuth = true;
});
```

### Disable Authentication

For development only (not recommended for production):

```csharp
options.AddDashboard(options =>
{
    options.BasePath = "/dashboard";
    options.EnableBasicAuth = false;       // No authentication
});
```

## Monitoring Best Practices

### 1. Regular Health Checks

- Monitor job success rates
- Check for stuck or failed jobs
- Review execution times
- Watch for error patterns

### 2. Performance Monitoring

- Track job execution duration
- Monitor queue depth
- Check system resource usage
- Identify bottlenecks

### 3. Error Management

- Review failed job logs
- Investigate error patterns
- Update retry strategies
- Fix underlying issues

## API Integration

### Programmatic Access

Access dashboard data via API:

```csharp
[HttpGet("dashboard/status")]
public async Task<ActionResult> GetDashboardStatus()
{
    // Access job statistics
    var stats = await tickerQService.GetJobStatistics();
    return Ok(stats);
}
```

### Custom Monitoring

Create custom monitoring endpoints:

```csharp
[HttpGet("health/jobs")]
public async Task<ActionResult> GetJobHealth()
{
    var health = new
    {
        ActiveJobs = await GetActiveJobCount(),
        FailedJobs = await GetFailedJobCount(),
        LastExecution = await GetLastExecutionTime(),
        SystemStatus = "Healthy"
    };
    
    return Ok(health);
}
```

## Troubleshooting

### Common Issues

1. **Dashboard not accessible**
   - Check base path configuration
   - Verify authentication credentials
   - Ensure TickerQ middleware is registered

2. **Jobs not appearing**
   - Verify job registration
   - Check TickerFunction attributes
   - Ensure services are registered in DI

3. **Authentication issues**
   - Verify credentials in appsettings.json
   - Check EnableBasicAuth setting
   - Clear browser cache

### Debug Mode

Enable detailed logging:

```json
{
  "Logging": {
    "LogLevel": {
      "TickerQ": "Debug",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

## Security Considerations

### Production Setup

1. **Use strong passwords**
2. **Enable HTTPS**
3. **Restrict access** by IP
4. **Regular credential rotation**
5. **Monitor access logs**

### Network Security

```csharp
// Restrict dashboard access
app.Map("/dashboard", dashboard =>
{
    dashboard.UseAuthentication();
    dashboard.UseAuthorization();
    // Dashboard routes
});
```

## Next Steps

Check out the [API Reference](/docs/api-reference) for complete code examples and implementation details.
