# Docker Troubleshooting Guide for Kaup

## Issue: Docker daemon not ready (500 Internal Server Error)

This error occurs when Docker Desktop is still starting up or hasn't fully initialized.

## Solutions:

### Option 1: Wait for Docker Desktop (Recommended)
Docker Desktop takes 30-60 seconds to fully start after opening.

1. **Check Docker Desktop UI**
   - Open Docker Desktop from Start Menu
   - Wait for the "Docker Desktop is running" message
   - The whale icon in the system tray should be steady (not animated)

2. **Wait and Retry**
   ```powershell
   # Wait 30 seconds
   Start-Sleep -Seconds 30
   
   # Test Docker
   docker info
   
   # If working, start PostgreSQL
   docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
   ```

### Option 2: Restart Docker Desktop
```powershell
# Stop Docker Desktop
Stop-Process -Name "Docker Desktop" -Force

# Wait a moment
Start-Sleep -Seconds 5

# Start Docker Desktop
& "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait for it to fully start (30-60 seconds)
Start-Sleep -Seconds 45

# Test
docker info
```

### Option 3: Use Local PostgreSQL (Without Docker)

If Docker continues to have issues, you can install PostgreSQL directly:

1. **Download PostgreSQL Installer**
   - Visit: https://www.postgresql.org/download/windows/
   - Download version 15 or later

2. **Install with these settings:**
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: postgres (we'll create kaup database)

3. **Create Kaup Database**
   ```powershell
   # Using psql (comes with PostgreSQL)
   & "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
   
   # In psql prompt:
   CREATE DATABASE kaup;
   \q
   ```

4. **Update Connection String**
   Your `backend/Kaup.Api/appsettings.json` already has:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=kaup;Username=postgres;Password=postgres"
   }
   ```
   This will work with local PostgreSQL too!

### Option 4: Use Docker Compose (Easier!)

Instead of running Docker commands manually, use docker-compose:

```powershell
# Make sure Docker Desktop is running first!
# Wait until 'docker info' works

# Then run:
docker-compose up -d db
```

This starts just the database from your docker-compose.yml file.

## Check if Docker is Ready

Run this command repeatedly until it works:
```powershell
docker info
```

When you see server information (not an error), Docker is ready!

## Quick Test Script

Save this as `test-docker.ps1`:
```powershell
Write-Host "Testing Docker Desktop..." -ForegroundColor Yellow

$maxAttempts = 12  # 12 attempts = 60 seconds
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "Attempt $attempt of $maxAttempts..." -ForegroundColor Gray
    
    try {
        docker info 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker is ready!" -ForegroundColor Green
            exit 0
        }
    } catch {
        # Docker not ready yet
    }
    
    Start-Sleep -Seconds 5
}

Write-Host "✗ Docker is not responding. Please:" -ForegroundColor Red
Write-Host "  1. Open Docker Desktop from Start Menu" -ForegroundColor Yellow
Write-Host "  2. Wait for 'Docker Desktop is running' message" -ForegroundColor Yellow
Write-Host "  3. Run this script again" -ForegroundColor Yellow
exit 1
```

Run it:
```powershell
.\test-docker.ps1
```

## Once Docker is Ready

Run these commands in order:

### 1. Start PostgreSQL
```powershell
docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
```

### 2. Verify it's running
```powershell
docker ps
```

You should see kaup-postgres in the list!

### 3. Start Backend API
```powershell
cd "backend\Kaup.Api"
dotnet run
```

### 4. Start Frontend
```powershell
cd frontend
npm run dev
```

## Common Docker Desktop Issues

### Issue: "Docker Desktop starting..." for too long
**Solution:** Restart your computer, then start Docker Desktop

### Issue: "Docker Desktop failed to start"
**Solution:** 
1. Enable Virtualization in BIOS
2. Enable WSL 2 in Windows Features
3. Reinstall Docker Desktop

### Issue: Port 5432 already in use
**Solution:**
```powershell
# Check what's using port 5432
netstat -ano | findstr :5432

# Stop any existing PostgreSQL
docker stop kaup-postgres
docker rm kaup-postgres

# Or stop Windows service
Stop-Service postgresql-x64-15
```

## Alternative: Use Docker Compose

The easiest way to manage all services:

```powershell
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Start only database
docker-compose up -d db
```

## Need More Help?

1. Check Docker Desktop logs:
   - Open Docker Desktop
   - Click Settings (gear icon)
   - Go to "Troubleshoot"
   - Click "Get support" for logs

2. Restart Docker Service:
   ```powershell
   Restart-Service com.docker.service
   ```

3. Use Windows Services:
   - Press Win+R
   - Type `services.msc`
   - Find "Docker Desktop Service"
   - Right-click → Restart

## Summary

**The most common fix:** Just wait 30-60 seconds after opening Docker Desktop, then try again!

```powershell
# Simple wait script
Write-Host "Waiting for Docker Desktop..." -ForegroundColor Yellow
Start-Sleep -Seconds 45
docker info
docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
```
