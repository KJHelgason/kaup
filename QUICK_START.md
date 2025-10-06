# 🚀 Kaup Quick Start Cheat Sheet

## ⚡ Super Quick Start (No Docker Required!)

If you have virtualization issues or just want to start quickly:

```powershell
# Run the automated script
.\start-backend.ps1
```

This starts the backend API automatically. No Docker needed!

Then in another terminal:
```powershell
cd frontend
npm run dev
```

**Prerequisites:** Install PostgreSQL for Windows from https://www.postgresql.org/download/windows/

---

## Start Development Environment (3 Commands)

### Option A: With Docker (Requires Virtualization)

#### 1. Start Database
```powershell
docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
```

#### 2. Start Backend
```powershell
cd "backend\Kaup.Api"
dotnet run
```
→ API: http://localhost:5000
→ Swagger: http://localhost:5000/swagger

#### 3. Start Frontend
```powershell
cd frontend
npm run dev
```
→ App: http://localhost:3000

### Option B: Without Docker (Use Windows PostgreSQL)

#### 1. Install PostgreSQL for Windows
Download from: https://www.postgresql.org/download/windows/
- Port: 5432
- Username: postgres  
- Password: postgres

#### 2. Start Backend
```powershell
.\start-backend.ps1
```
Or manually:
```powershell
cd "backend\Kaup.Api"
dotnet run
```
→ API: http://localhost:5000
→ Swagger: http://localhost:5000/swagger

#### 3. Start Frontend
```powershell
cd frontend
npm run dev
```
→ App: http://localhost:3000

---

## Test the API (Swagger or curl)

### Get All Listings
```powershell
curl http://localhost:5000/api/listings
```

### Create a Listing
```powershell
curl -X POST http://localhost:5000/api/listings `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Test Item",
    "description": "A great product",
    "price": 5000,
    "category": "Electronics",
    "condition": "New",
    "listingType": "BuyNow",
    "imageUrls": []
  }'
```

### Search Listings
```powershell
curl "http://localhost:5000/api/listings?search=test&minPrice=1000&maxPrice=10000"
```

### Get Featured Listings
```powershell
curl http://localhost:5000/api/listings/featured
```

---

## Docker Commands

### View Running Containers
```powershell
docker ps
```

### Stop Database
```powershell
docker stop kaup-postgres
```

### Start Existing Database
```powershell
docker start kaup-postgres
```

### Remove Database (Warning: Deletes data!)
```powershell
docker rm -f kaup-postgres
```

### View Database Logs
```powershell
docker logs kaup-postgres
```

---

## .NET Commands

### Restore Packages
```powershell
cd backend\Kaup.Api
dotnet restore
```

### Build Project
```powershell
dotnet build
```

### Run Migrations
```powershell
dotnet ef database update
```

### Create New Migration
```powershell
dotnet ef migrations add MigrationName
```

### Remove Last Migration
```powershell
dotnet ef migrations remove
```

### List Migrations
```powershell
dotnet ef migrations list
```

---

## Frontend Commands

### Install Dependencies
```powershell
cd frontend
npm install
```

### Run Development Server
```powershell
npm run dev
```

### Build for Production
```powershell
npm run build
```

### Start Production Server
```powershell
npm start
```

### Install shadcn/ui Component
```powershell
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Find process on port 5432
netstat -ano | findstr :5432

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Reset Everything
```powershell
# Stop and remove database
docker rm -f kaup-postgres

# Clean backend
cd backend\Kaup.Api
dotnet clean
rm -r bin, obj

# Clean frontend
cd frontend
rm -r .next, node_modules
npm install
```

### Database Connection Issues
1. Check Docker is running: `docker ps`
2. Check connection string in `appsettings.json`
3. Verify port 5432 is not blocked

---

## Project URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Next.js app |
| Backend API | http://localhost:5000 | .NET API |
| Swagger UI | http://localhost:5000/swagger | API docs |
| Database | localhost:5432 | PostgreSQL |

---

## Database Connection Details

```
Host: localhost
Port: 5432
Database: kaup
Username: postgres
Password: postgres
```

Connect with psql:
```powershell
docker exec -it kaup-postgres psql -U postgres -d kaup
```

Common SQL commands:
```sql
\l              -- List databases
\c kaup         -- Connect to kaup database
\dt             -- List tables
\d Users        -- Describe Users table
SELECT * FROM "Listings" LIMIT 10;
```

---

## File Locations

```
📁 Backend
├── Controllers/     → API endpoints
├── Models/          → Database entities
├── Data/           → DbContext
├── DTOs/           → API contracts
└── Migrations/     → DB migrations

📁 Frontend
├── src/app/        → Pages (App Router)
├── src/components/ → React components
├── src/lib/        → Utilities
└── public/         → Static files
```

---

## API Endpoints Quick Reference

```
GET    /api/listings              - Get all listings
GET    /api/listings/{id}         - Get single listing
POST   /api/listings              - Create listing
PUT    /api/listings/{id}         - Update listing
DELETE /api/listings/{id}         - Delete listing
GET    /api/listings/featured     - Get featured
GET    /api/listings/categories   - Get categories
```

Query Parameters:
- `?category=Electronics`
- `?search=keyword`
- `?minPrice=1000&maxPrice=5000`
- `?featured=true`
- `?page=1&pageSize=20`

---

## Environment Variables

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=kaup;Username=postgres;Password=postgres"
  }
}
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Git Commands (When Ready)

```powershell
# Initialize git
git init
git add .
git commit -m "Initial commit: Kaup marketplace MVP"

# Connect to GitHub
git remote add origin https://github.com/yourusername/kaup.git
git push -u origin main
```

---

## Common Tasks

### Add a New Model
1. Create model in `Models/`
2. Add DbSet to `KaupDbContext.cs`
3. Run: `dotnet ef migrations add AddNewModel`
4. Run: `dotnet ef database update`

### Add a New API Endpoint
1. Add method to controller
2. Test in Swagger
3. Update frontend API service

### Add a New Page
1. Create file in `frontend/src/app/`
2. Add route in navigation
3. Build components

---

## Performance Tips

- Enable caching for listings: Add Redis
- Use pagination: Already implemented
- Optimize images: Add Sharp for Next.js
- Database indexes: Add to frequently queried fields
- CDN: Use CloudFront for static assets

---

## Security Checklist

- [ ] Change default database password
- [ ] Add JWT authentication
- [ ] Enable HTTPS in production
- [ ] Sanitize user input
- [ ] Add rate limiting
- [ ] Enable CORS only for known origins
- [ ] Use environment variables for secrets
- [ ] Enable SQL injection protection (EF Core default)

---

## Next Features to Build

1. ✅ Backend API - DONE
2. 🔲 Theme switcher
3. 🔲 Language switcher
4. 🔲 User authentication
5. 🔲 Listing detail page
6. 🔲 Create listing form
7. 🔲 Search & filters UI
8. 🔲 Bidding system
9. 🔲 Messaging
10. 🔲 Image upload

---

**Pro Tip**: Keep this file open while developing! 🎯

See full documentation in:
- PROJECT_SUMMARY.md
- SETUP_GUIDE.md
- README.md
- AWS_DEPLOYMENT.md
