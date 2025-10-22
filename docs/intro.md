# Introduction

Welcome to the TickerQ Demo Documentation! This guide will help you understand and implement background job processing using TickerQ in your .NET applications.

## What is TickerQ?

TickerQ is a high-performance, reflection-free background task scheduler for .NET. It provides:

- **Cron-based scheduling** for recurring jobs
- **Time-based scheduling** for one-time jobs  
- **Dashboard interface** for monitoring and management
- **Exception handling** with custom handlers
- **Entity Framework Core integration** for persistence
- **High performance** with minimal overhead

## Project Overview

This demo project showcases a complete TickerQ implementation with:

- **Request Management System** - CRUD operations for requests with status tracking
- **Background Jobs** - Auto-rejection of stale requests and report generation
- **Exception Handling** - Custom exception handler for job failures
- **Dashboard** - Web interface for job monitoring
- **API Endpoints** - RESTful API for scheduling jobs

## Prerequisites

Before getting started, ensure you have:

- **.NET 10.0** or later
- **SQL Server** (LocalDB, Express, or full version)
- **Node.js** (for documentation site)
- **Visual Studio** or **VS Code** with C# extension

## Architecture

The project follows Clean Architecture principles:

```
TickerQ_Demo/
├── Domain/           # Entities and Enums
├── Application/      # Services and Jobs
├── Infrastructure/   # Data Access and Persistence
├── TickerQ_Demo/     # Web API and Controllers
└── docs/            # Documentation Site
```

## Key Features Demonstrated

- **Scheduled Jobs**: Auto-reject approved requests after 3 minutes
- **Report Generation**: Create reports every 5 minutes
- **One-time Jobs**: Schedule jobs via API endpoints
- **Exception Handling**: Custom error handling for failed jobs
- **Dashboard**: Monitor job execution and status

Let's get started with the [installation guide](/docs/installation)!
