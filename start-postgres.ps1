# Start PostgreSQL Service (Run as Administrator)

Write-Host "Starting PostgreSQL Service..." -ForegroundColor Yellow

try {
    Start-Service postgresql-x64-16
    Write-Host "✓ PostgreSQL started successfully!" -ForegroundColor Green
    
    # Verify it's running
    $service = Get-Service postgresql-x64-16
    if ($service.Status -eq "Running") {
        Write-Host "✓ PostgreSQL is now running on port 5432" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error: Could not start PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script as Administrator:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor White
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "3. Run: .\start-postgres.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Or start it manually:" -ForegroundColor Yellow
    Write-Host "1. Press Win + R" -ForegroundColor White
    Write-Host "2. Type: services.msc" -ForegroundColor White
    Write-Host "3. Find 'postgresql-x64-16'" -ForegroundColor White
    Write-Host "4. Right-click → Start" -ForegroundColor White
}
