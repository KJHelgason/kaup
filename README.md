# Kaup - Icelandic Marketplace Platform

An Icelandic version of eBay built with Next.js, .NET 8, and PostgreSQL.

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Dark/Light mode** toggle
- **Icelandic/English** language switcher

### Backend
- **.NET 8 Web API**
- **Entity Framework Core**
- **PostgreSQL** database
- **JWT Authentication**

### Infrastructure
- **Docker** & **Docker Compose** for local development
- **AWS** for production hosting

## Features

- ✅ User registration and authentication
- ✅ Create, search, and browse listings
- ✅ Bidding system with real-time updates
- ✅ Buy Now option for instant purchases
- ✅ Messaging system between buyers and sellers
- ✅ Categories and advanced filters
- ✅ Featured listings and daily deals
- ✅ User profiles with:
  - Active listings
  - Purchase history
  - Saved items
- ✅ Dark/Light mode toggle
- ✅ Icelandic/English language switcher with flag icons

## Project Structure

```
kaup/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and helpers
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   └── Dockerfile
├── backend/              # .NET 8 Web API
│   └── Kaup.Api/
│       ├── Controllers/  # API endpoints
│       ├── Models/       # Database models
│       ├── Data/         # DbContext and configurations
│       ├── DTOs/         # Data transfer objects
│       └── Migrations/   # EF Core migrations
└── docker-compose.yml    # Local development setup
```

## Local Development Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kaup
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend API on http://localhost:5000
   - PostgreSQL on localhost:5432

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:5000/swagger

### Manual Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/Kaup.Api
   ```

2. **Restore packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=kaup;Username=postgres;Password=postgres"
     }
   }
   ```

4. **Run migrations**
   ```bash
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Users
- Id (Guid)
- Email (unique)
- PasswordHash
- FirstName, LastName
- PhoneNumber (optional)
- ProfileImageUrl (optional)
- CreatedAt, UpdatedAt

### Listings
- Id (Guid)
- Title, Description
- Price, BuyNowPrice (optional)
- Category, Condition
- ImageUrls (array)
- ListingType (Auction, BuyNow, Both)
- Status (Draft, Active, Sold, Expired, Cancelled)
- IsFeatured
- SellerId (FK to Users)
- CreatedAt, EndDate, UpdatedAt

### Bids
- Id (Guid)
- Amount
- ListingId (FK to Listings)
- BidderId (FK to Users)
- CreatedAt

### Messages
- Id (Guid)
- Content
- IsRead
- SenderId (FK to Users)
- ReceiverId (FK to Users)
- ListingId (optional FK to Listings)
- CreatedAt

## API Endpoints

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/{id}` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/{id}` - Update listing
- `DELETE /api/listings/{id}` - Delete listing
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/categories` - Get all categories

### Query Parameters
- `category` - Filter by category
- `search` - Search in title and description
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `featured` - Filter featured listings
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)

## AWS Production Architecture

### Recommended AWS Services

```
┌─────────────────────────────────────────────────────────────┐
│                         CloudFront CDN                       │
│                    (Global Content Delivery)                 │
└────────────┬──────────────────────────────┬─────────────────┘
             │                              │
             ▼                              ▼
┌────────────────────────┐    ┌────────────────────────────────┐
│    AWS Amplify         │    │   Application Load Balancer    │
│  (Next.js Frontend)    │    │                                │
│  - Auto scaling        │    └──────────────┬─────────────────┘
│  - CI/CD from GitHub   │                   │
│  - Global CDN          │                   ▼
└────────────────────────┘    ┌────────────────────────────────┐
                              │      AWS ECS Fargate           │
                              │    (.NET API Containers)       │
                              │  - Auto scaling                │
                              │  - High availability           │
                              └──────────────┬─────────────────┘
                                             │
                              ┌──────────────┴─────────────────┐
                              │                                │
                              ▼                                ▼
                  ┌────────────────────┐        ┌─────────────────────┐
                  │  Amazon RDS        │        │    Amazon S3        │
                  │  (PostgreSQL)      │        │  (Image Storage)    │
                  │  - Multi-AZ        │        │  - CDN integration  │
                  │  - Auto backups    │        └─────────────────────┘
                  └────────────────────┘
```

### AWS Services Breakdown

1. **Frontend Hosting - AWS Amplify**
   - Automated builds and deployments from GitHub
   - Built-in CDN and SSL certificates
   - Environment variables management
   - Preview deployments for PR reviews

2. **Backend API - Amazon ECS with Fargate**
   - Containerized .NET API
   - Serverless container management
   - Auto-scaling based on traffic
   - Load balancer for high availability

3. **Database - Amazon RDS (PostgreSQL)**
   - Managed PostgreSQL instance
   - Multi-AZ deployment for failover
   - Automated backups
   - Read replicas for scaling

4. **Storage - Amazon S3**
   - Store listing images and user uploads
   - CloudFront integration for fast delivery
   - Lifecycle policies for cost optimization

5. **Authentication - Amazon Cognito**
   - User pool management
   - OAuth integration (Google)
   - JWT token generation
   - MFA support

6. **Caching - Amazon ElastiCache (Redis)**
   - Cache frequently accessed listings
   - Session management
   - Real-time bidding data

7. **Message Queue - Amazon SQS**
   - Asynchronous job processing
   - Email notifications
   - Bid processing

8. **Monitoring - CloudWatch**
   - Application logs
   - Performance metrics
   - Alarms and notifications

### Deployment Steps

1. **Set up AWS account and configure AWS CLI**
2. **Create RDS PostgreSQL database**
3. **Deploy backend to ECS:**
   - Build Docker image
   - Push to ECR (Elastic Container Registry)
   - Create ECS task definition
   - Configure load balancer
4. **Deploy frontend to Amplify:**
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables
5. **Configure domain and SSL certificates**
6. **Set up CloudFront for global CDN**

### Estimated AWS Costs (Monthly)

- **Small Scale** (< 1000 users): $50-150/month
  - RDS db.t4g.micro
  - ECS Fargate (1 task)
  - Amplify hosting
  
- **Medium Scale** (< 10,000 users): $300-600/month
  - RDS db.t4g.large
  - ECS Fargate (2-4 tasks)
  - ElastiCache
  - S3 & CloudFront

- **Large Scale** (> 100,000 users): $1000+/month
  - RDS db.r6g.xlarge with read replicas
  - ECS Fargate auto-scaling
  - Enhanced monitoring
  - Multi-region setup

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=kaup;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "your-secret-key-min-32-characters-long",
    "Issuer": "kaup-marketplace",
    "Audience": "kaup-clients"
  }
}
```

## Development Roadmap

### Phase 1 - MVP (Current)
- ✅ Basic listing CRUD
- ✅ User authentication
- ✅ Search and filters
- ✅ Theme and language switcher

### Phase 2 - Core Features
- [ ] Real-time bidding system
- [ ] Messaging between users
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] User ratings and reviews

### Phase 3 - Advanced Features
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor support
- [ ] Shipping integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@kaup.is or open an issue on GitHub.
