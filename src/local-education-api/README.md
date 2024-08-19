# Local Education API

## Requirements

- .NET 7.0
- Entity Framework CLI 7.0 or higher (Not required if using Visual Studio)
- SQL Server 2019 or higher
- SQL Server Management Studio or Azure Data Studio
- Docker (optional)

## Create SQL Server `sa` account

### With SQL Server Management Studio

**Method 1: Using GUI**

- Login to SQL Server
- `Right-click on current connection > Properties`
- Select `Security` page
- Set `Server authentication` to `SQL Server and Windows Authentication mode` then click `OK`
- Navigate to `Security > Logins` and `Right-click` on the `sa` account
- At `General` page, change `Password` and `Confirm password` to `Admin123!`
- Select `Status` page, and set `Login` to `Enable`

**Method 2: Using script**

- Open new query and execute this script:

```sql
  USE [master]  
  GO  
  ALTER LOGIN [sa] WITH PASSWORD=N'Admin123!'  
  GO  
  ALTER LOGIN [sa] ENABLE  
  GO
```

### With Docker

- Pull SQL Server image:


```
  docker pull mcr.microsoft.com/mssql/server
```

- Run container with `sa` account:

```
  docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=Admin123!' -p 1433:1433 -d --name sqlserver mcr.microsoft.com/mssql/server
```

## Build Solution and Update Database

### With Visual Studio

- Open Solution in Microsoft Visual Studio
- Build Solution with `Ctrl + Shift + B` or `Right-click Solution > Build`
- Open Package Manager Console with `` Ctrl + ` `` or select `Tool > NuGet Package Manager > Package Manager Console`
- Change `Default project` to `LocalEducation.Data`
- Run:

```
  Update-Database
```

### With Entity Framework CLI

- Open **terminal** at `local-education/src/local-education-api/LocalEducation.WebApi` and run these commands:

```
  dotnet build
  dotnet-ef database update
```

## Run Stored Procedures

- Open `local-education/src/local-education-database/Stored Procedures/StoredProcedures.sql` in **SQL Server Management Studio** or **Azure Data Studio** and execute the script

## Run project

### With Visual Studio

- `Right-click LocalEducation.WebApi` project > `Set as Startup Project`
- Run project with `Ctrl + F5`

### With .NET CLI

- Open **terminal** at `local-education/src/local-education-api/LocalEducation.WebApi` and run:

```
  dotnet run --urls=https://localhost:7272
```
