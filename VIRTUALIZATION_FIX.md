# Fixing "Virtualization support not detected" Error

## The Issue
Docker Desktop requires hardware virtualization (VT-x/AMD-V) to be enabled in your BIOS/UEFI settings.

## Quick Solutions

### Solution 1: Enable Virtualization in BIOS (Recommended for Full Docker Support)

#### Step-by-Step Instructions:

1. **Restart your computer**

2. **Enter BIOS/UEFI Setup**
   - During boot, press one of these keys (depends on your PC manufacturer):
     - **Dell**: F2 or F12
     - **HP**: F10 or Esc
     - **Lenovo**: F1 or F2
     - **ASUS**: F2 or Del
     - **Acer**: F2 or Del
     - **MSI**: Del
     - **Generic/Custom PC**: Del or F2

3. **Find Virtualization Setting**
   The setting is usually in one of these locations:
   - **Advanced** → **CPU Configuration** → **Intel Virtualization Technology** or **AMD-V**
   - **Security** → **Virtualization**
   - **Advanced** → **System Configuration** → **Virtualization Technology**
   - **Configuration** → **Intel Virtual Technology**

4. **Enable the Setting**
   - Look for: "Intel Virtualization Technology", "Intel VT-x", "AMD-V", or just "Virtualization"
   - Change from **Disabled** to **Enabled**
   - Also enable "VT-d" or "Intel VT-d" if available

5. **Save and Exit**
   - Usually F10 to save and exit
   - Computer will restart

6. **Verify Virtualization is Enabled**
   ```powershell
   # Check if virtualization is enabled
   Get-ComputerInfo | Select-Object -Property CsHypervisorPresent, HyperVRequirementVirtualizationFirmwareEnabled
   ```
   
   Both should show **True**

7. **Start Docker Desktop**
   - It should now work properly!

---

### Solution 2: Use Native PostgreSQL (No Docker Required!)

If you can't enable virtualization, you can still develop the Kaup marketplace! Just install PostgreSQL directly on Windows.

#### Install PostgreSQL on Windows:

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (version 15 or later)

2. **Run the Installer**
   - Port: **5432** (default)
   - Username: **postgres**
   - Password: **postgres** (or your choice)
   - Install pgAdmin 4 (optional but helpful)

3. **Create Kaup Database**
   
   Option A - Using pgAdmin:
   - Open pgAdmin 4
   - Right-click "Databases" → Create → Database
   - Name: **kaup**
   - Click Save

   Option B - Using Command Line:
   ```powershell
   # Navigate to PostgreSQL bin directory
   cd "C:\Program Files\PostgreSQL\15\bin"
   
   # Connect to PostgreSQL
   .\psql.exe -U postgres
   
   # Create database (in psql prompt)
   CREATE DATABASE kaup;
   
   # Exit
   \q
   ```

4. **Your Connection String Already Works!**
   
   The `backend/Kaup.Api/appsettings.json` already has:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=kaup;Username=postgres;Password=postgres"
   }
   ```
   
   This works with Windows PostgreSQL too! ✅

5. **Start Development**
   ```powershell
   # Start backend
   cd "backend\Kaup.Api"
   dotnet run
   
   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

---

### Solution 3: Use SQLite (Simplest - No Install Required!)

For initial development, you can use SQLite instead of PostgreSQL. It's a file-based database with zero configuration.

#### Switch to SQLite:

1. **Update NuGet Package**
   ```powershell
   cd "backend\Kaup.Api"
   dotnet add package Microsoft.EntityFrameworkCore.Sqlite
   ```

2. **Update `appsettings.json`**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=kaup.db"
     }
   }
   ```

3. **Update `Program.cs`**
   Change this line:
   ```csharp
   options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
   ```
   
   To:
   ```csharp
   options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
   ```

4. **Recreate Migrations**
   ```powershell
   # Remove old migrations
   rm -r Migrations
   
   # Create new SQLite migration
   dotnet ef migrations add InitialCreate
   
   # Run
   dotnet run
   ```

   A `kaup.db` file will be created automatically! ✅

---

### Solution 4: Use Cloud Database (No Local DB Needed!)

Use a free cloud PostgreSQL database:

#### Option A: ElephantSQL (Free Tier)
1. Go to: https://www.elephantsql.com/
2. Sign up for free account
3. Create a "Tiny Turtle" free instance
4. Copy the connection URL
5. Update `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=hostname.db.elephantsql.com;Database=dbname;Username=user;Password=pass"
     }
   }
   ```

#### Option B: Supabase (Free Tier)
1. Go to: https://supabase.com/
2. Create free account
3. Create new project
4. Get database connection string from Settings → Database
5. Update `appsettings.json` with the connection string

#### Option C: Neon (Free Tier - Serverless PostgreSQL)
1. Go to: https://neon.tech/
2. Sign up for free
3. Create a project
4. Copy connection string
5. Update `appsettings.json`

---

## Comparison of Solutions

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| **Enable Virtualization** | Full Docker support, matches production | Requires BIOS access | Long-term development |
| **Windows PostgreSQL** | Full PostgreSQL features, easy | Manual installation | Local development |
| **SQLite** | Zero config, no install | Different from production | Quick prototyping |
| **Cloud Database** | No local setup, accessible anywhere | Requires internet | Testing/demos |

---

## Recommended Path Forward

### For Quick Start (Right Now):
```powershell
# Use SQLite - Fastest to get started!

cd "backend\Kaup.Api"

# Add SQLite package
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# Update Program.cs to use SQLite (I'll show you the code)
# Then run:
dotnet ef migrations add InitialCreate
dotnet run
```

### For Production-Ready Development:
1. Enable virtualization in BIOS
2. Use Docker with PostgreSQL
3. Matches AWS production environment

### For Immediate Development (Without BIOS Access):
1. Install PostgreSQL for Windows
2. Continue with existing setup
3. Everything else works the same!

---

## Easy Start Script (Using PostgreSQL for Windows)

Save this as `start-dev-no-docker.ps1`:

```powershell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Kaup - No Docker Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "✓ PostgreSQL service found!" -ForegroundColor Green
    
    if ($pgService.Status -eq "Running") {
        Write-Host "✓ PostgreSQL is running!" -ForegroundColor Green
    } else {
        Write-Host "⏳ Starting PostgreSQL..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Write-Host "✓ PostgreSQL started!" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ PostgreSQL not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Install PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Use SQLite instead (see VIRTUALIZATION_FIX.md)" -ForegroundColor White
    Write-Host "3. Use a cloud database (see VIRTUALIZATION_FIX.md)" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Continue anyway? (Y/N)"
    if ($response -ne "Y" -and $response -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📝 Starting Backend API..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "backend\Kaup.Api"
dotnet run
```

---

## Which Solution Should You Choose?

### Right Now (Next 5 minutes):
✅ **Install PostgreSQL for Windows** - It's the closest to your current setup and requires no code changes!

### Download Here:
🔗 https://www.postgresql.org/download/windows/

After installation, run:
```powershell
cd "backend\Kaup.Api"
dotnet run
```

Everything will just work! ✅

---

## Need Help?

Check these files:
- `QUICK_START.md` - All commands
- `SETUP_GUIDE.md` - Complete setup
- `DOCKER_TROUBLESHOOTING.md` - Docker issues
- This file - Virtualization fixes

---

## Summary

**You have 4 options:**
1. ⚙️ Enable virtualization in BIOS (best long-term)
2. 💾 Install PostgreSQL for Windows (easiest right now)
3. 📄 Use SQLite (quickest, zero config)
4. ☁️ Use cloud database (no local setup)

**My recommendation:** Install PostgreSQL for Windows now, enable virtualization later when convenient.

**Next command:**
```powershell
cd "backend\Kaup.Api"
dotnet run
```

The API will tell you if the database connection works! 🚀
