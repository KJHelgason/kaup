# Kaup - Start Development Environment
# This script waits for Docker to be ready and starts all services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Kaup Development Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test Docker
function Test-Docker {
    try {
        $null = docker info 2>&1
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

# Check if Docker Desktop is running
Write-Host "🔍 Checking Docker Desktop..." -ForegroundColor Yellow

if (-not (Test-Docker)) {
    Write-Host "⏳ Docker Desktop is starting... Please wait..." -ForegroundColor Yellow
    
    $maxAttempts = 12
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $attempt++
        Write-Host "   Attempt $attempt of $maxAttempts..." -ForegroundColor Gray
        
        if (Test-Docker) {
            Write-Host "✓ Docker Desktop is ready!" -ForegroundColor Green
            break
        }
        
        if ($attempt -eq $maxAttempts) {
            Write-Host ""
            Write-Host "❌ Docker Desktop is not responding!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please:" -ForegroundColor Yellow
            Write-Host "  1. Open Docker Desktop from Start Menu" -ForegroundColor White
            Write-Host "  2. Wait for 'Docker Desktop is running' message" -ForegroundColor White
            Write-Host "  3. Run this script again: .\start-dev.ps1" -ForegroundColor White
            Write-Host ""
            Write-Host "Or use local PostgreSQL instead (see DOCKER_TROUBLESHOOTING.md)" -ForegroundColor Gray
            exit 1
        }
        
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "✓ Docker Desktop is ready!" -ForegroundColor Green
}

Write-Host ""

# Check if PostgreSQL container already exists
$existingContainer = docker ps -a --filter "name=kaup-postgres" --format "{{.Names}}" 2>$null

if ($existingContainer -eq "kaup-postgres") {
    Write-Host "🔍 Found existing PostgreSQL container..." -ForegroundColor Yellow
    
    # Check if it's running
    $runningContainer = docker ps --filter "name=kaup-postgres" --format "{{.Names}}" 2>$null
    
    if ($runningContainer -eq "kaup-postgres") {
        Write-Host "✓ PostgreSQL is already running!" -ForegroundColor Green
    } else {
        Write-Host "⏳ Starting existing PostgreSQL container..." -ForegroundColor Yellow
        docker start kaup-postgres
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL started!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to start PostgreSQL!" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "⏳ Creating PostgreSQL container..." -ForegroundColor Yellow
    docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL container created and started!" -ForegroundColor Green
        Write-Host "⏳ Waiting for PostgreSQL to be ready (5 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "❌ Failed to create PostgreSQL container!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible issues:" -ForegroundColor Yellow
        Write-Host "  - Port 5432 is already in use" -ForegroundColor White
        Write-Host "  - Run: docker ps -a" -ForegroundColor White
        Write-Host "  - See DOCKER_TROUBLESHOOTING.md for help" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ PostgreSQL is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Connection:" -ForegroundColor White
Write-Host "  Host:     localhost" -ForegroundColor Gray
Write-Host "  Port:     5432" -ForegroundColor Gray
Write-Host "  Database: kaup" -ForegroundColor Gray
Write-Host "  Username: postgres" -ForegroundColor Gray
Write-Host "  Password: postgres" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📝 Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend API:" -ForegroundColor Yellow
Write-Host "   cd backend\Kaup.Api" -ForegroundColor White
Write-Host "   dotnet run" -ForegroundColor White
Write-Host "   → API will be at: http://localhost:5000" -ForegroundColor Gray
Write-Host "   → Swagger docs: http://localhost:5000/swagger" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   → App will be at: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: Check QUICK_START.md for all commands!" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start the backend
Write-Host "Would you like to start the backend API now? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting backend API..." -ForegroundColor Yellow
    Write-Host ""
    Set-Location "backend\Kaup.Api"
    dotnet run
}
