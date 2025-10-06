# Kaup - Start Development (No Docker Required)
# This script starts the backend API without Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Kaup Development - No Docker Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script runs Kaup without Docker." -ForegroundColor Gray
Write-Host "Perfect for when virtualization is disabled!" -ForegroundColor Gray
Write-Host ""

# Check if PostgreSQL service exists
Write-Host "🔍 Checking for PostgreSQL..." -ForegroundColor Yellow

$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "✓ Found PostgreSQL service: $($pgService.Name)" -ForegroundColor Green
    
    if ($pgService.Status -eq "Running") {
        Write-Host "✓ PostgreSQL is already running!" -ForegroundColor Green
    } else {
        Write-Host "⏳ Starting PostgreSQL service..." -ForegroundColor Yellow
        try {
            Start-Service $pgService.Name
            Start-Sleep -Seconds 2
            Write-Host "✓ PostgreSQL started successfully!" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Could not start PostgreSQL automatically" -ForegroundColor Yellow
            Write-Host "  Please start it manually from Services" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Database Connection:" -ForegroundColor White
    Write-Host "  Host:     localhost" -ForegroundColor Gray
    Write-Host "  Port:     5432" -ForegroundColor Gray
    Write-Host "  Database: kaup" -ForegroundColor Gray
    Write-Host "  Username: postgres" -ForegroundColor Gray
    Write-Host ""
    
} else {
    Write-Host "⚠ PostgreSQL is not installed!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have 3 options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Install PostgreSQL (Recommended)" -ForegroundColor White
    Write-Host "   → Download: https://www.postgresql.org/download/windows/" -ForegroundColor Gray
    Write-Host "   → Use default settings, port 5432, password: postgres" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Use SQLite instead (No installation)" -ForegroundColor White
    Write-Host "   → See VIRTUALIZATION_FIX.md for instructions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Use a free cloud database" -ForegroundColor White
    Write-Host "   → ElephantSQL, Supabase, or Neon" -ForegroundColor Gray
    Write-Host "   → See VIRTUALIZATION_FIX.md for details" -ForegroundColor Gray
    Write-Host ""
    
    $response = Read-Host "Try to start backend anyway? (Y/N)"
    if ($response -ne "Y" -and $response -ne "y") {
        Write-Host ""
        Write-Host "Exiting. Install PostgreSQL and run this script again!" -ForegroundColor Cyan
        exit
    }
    
    Write-Host ""
    Write-Host "⚠ Backend will start but database connections will fail until you set up a database." -ForegroundColor Yellow
    Write-Host ""
}

# Check if backend exists
if (-not (Test-Path "backend\Kaup.Api\Kaup.Api.csproj")) {
    Write-Host "❌ Error: Backend project not found!" -ForegroundColor Red
    Write-Host "   Make sure you're in the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🔧 Starting Backend API..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "backend\Kaup.Api"

Write-Host "📦 Restoring packages..." -ForegroundColor Yellow
dotnet restore --verbosity quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Packages restored!" -ForegroundColor Green
} else {
    Write-Host "⚠ Warning: Package restore had issues" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏗️ Building project..." -ForegroundColor Yellow
dotnet build --verbosity quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Starting API Server..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API will be available at:" -ForegroundColor White
Write-Host "  → http://localhost:5000" -ForegroundColor Cyan
Write-Host "  → http://localhost:5000/swagger (API docs)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Run the API
dotnet run
