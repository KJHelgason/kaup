# Kaup Setup Summary

## ✅ What We've Completed

### Backend (.NET 8 API)
1. ✅ Created complete .NET 8 Web API project structure
2. ✅ Configured Entity Framework Core with PostgreSQL
3. ✅ Created database models:
   - User (authentication and profile)
   - Listing (marketplace items)
   - Bid (auction system)
   - Message (buyer-seller communication)
4. ✅ Implemented comprehensive Listings API with:
   - GET /api/listings (with filtering, pagination, search)
   - GET /api/listings/{id}
   - POST /api/listings
   - PUT /api/listings/{id}
   - DELETE /api/listings/{id}
   - GET /api/listings/featured
   - GET /api/listings/categories
5. ✅ Created initial database migration
6. ✅ Configured CORS for frontend integration
7. ✅ Set up automatic database migration on startup

### Project Structure
1. ✅ Created organized folder structure
2. ✅ Set up Docker Compose configuration
3. ✅ Created Dockerfiles for both frontend and backend
4. ✅ Added comprehensive README with:
   - Setup instructions
   - API documentation
   - AWS architecture diagram
   - Cost estimates

### Frontend (Next.js)
1. ✅ Created Next.js 14 application with:
   - TypeScript
   - TailwindCSS
   - App Router
   - ESLint

## 📋 Next Steps

### 1. Start Docker Desktop
Make sure Docker Desktop is running before proceeding with the next steps.

### 2. Start the Database
```powershell
docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
```

### 3. Run the Backend API
```powershell
cd backend\Kaup.Api
dotnet run
```

The API will be available at: http://localhost:5000
Swagger documentation: http://localhost:5000/swagger

### 4. Complete Frontend Setup

We need to add the following to the frontend:

#### A. Install shadcn/ui components
```powershell
cd frontend
npx shadcn@latest init
```

When prompted, choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Then install components:
```powershell
npx shadcn@latest add button card input label select dropdown-menu
```

#### B. Create Theme Provider
Create `frontend/src/components/theme-provider.tsx`:
```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

Install next-themes:
```powershell
npm install next-themes
```

#### C. Create Language Context
Create `frontend/src/contexts/LanguageContext.tsx`:
```typescript
"use client"

import React, { createContext, useContext, useState } from 'react'

type Language = 'is' | 'en'

type Translations = {
  [key: string]: {
    is: string
    en: string
  }
}

const translations: Translations = {
  home: { is: 'Heim', en: 'Home' },
  browse: { is: 'Skoða', en: 'Browse' },
  sell: { is: 'Selja', en: 'Sell' },
  myAccount: { is: 'Mínar síður', en: 'My Account' },
  // Add more translations as needed
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('is')

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
```

#### D. Create Header Component with Theme & Language Switcher
Create `frontend/src/components/Header.tsx`:
```typescript
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">Kaup</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="/" className="hover:text-primary">{t('home')}</a>
            <a href="/browse" className="hover:text-primary">{t('browse')}</a>
            <a href="/sell" className="hover:text-primary">{t('sell')}</a>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'is' ? 'en' : 'is')}
          >
            {language === 'is' ? '🇮🇸' : '🇬🇧'} {language.toUpperCase()}
          </Button>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button>{t('myAccount')}</Button>
        </div>
      </div>
    </header>
  )
}
```

#### E. Update Root Layout
Update `frontend/src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaup - Icelandic Marketplace",
  description: "Buy and sell items in Iceland",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### F. Create API Service
Create `frontend/src/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  buyNowPrice?: number
  category: string
  condition: string
  imageUrls: string[]
  listingType: string
  status: string
  isFeatured: boolean
  createdAt: string
  endDate?: string
  seller: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  bidCount: number
  highestBid?: number
}

export async function getListings(params?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  page?: number
  pageSize?: number
}): Promise<{ listings: Listing[]; totalCount: number }> {
  const queryParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })
  }

  const response = await fetch(`${API_URL}/listings?${queryParams}`)
  const listings = await response.json()
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0')

  return { listings, totalCount }
}

export async function getListing(id: string): Promise<Listing> {
  const response = await fetch(`${API_URL}/listings/${id}`)
  return response.json()
}

export async function getFeaturedListings(count: number = 10): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/listings/featured?count=${count}`)
  return response.json()
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_URL}/listings/categories`)
  return response.json()
}
```

#### G. Create Homepage
Update `frontend/src/app/page.tsx`:
```typescript
import { Header } from "@/components/Header"
import { getFeaturedListings } from "@/lib/api"

export default async function Home() {
  const featuredListings = await getFeaturedListings(6)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Velkomin í Kaup
          </h1>
          <p className="text-xl text-muted-foreground">
            Kauptu og seldu í Íslensku markaðinum
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Úrvalsvörur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <div key={listing.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted"></div>
                <div className="p-4">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="mt-2">
                    <span className="text-lg font-bold">{listing.price} kr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
```

### 5. Run the Full Stack

Terminal 1 - Database:
```powershell
docker run --name kaup-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=kaup -p 5432:5432 -d postgres:15
```

Terminal 2 - Backend:
```powershell
cd backend\Kaup.Api
dotnet run
```

Terminal 3 - Frontend:
```powershell
cd frontend
npm run dev
```

### 6. Test the Application

1. Open http://localhost:3000 in your browser
2. Test the theme switcher (light/dark mode)
3. Test the language switcher (IS/EN)
4. View the API at http://localhost:5000/swagger

## 🎯 Additional Features to Implement

1. **Authentication System**
   - User registration
   - Login/logout
   - JWT token management
   - Password reset

2. **Bidding System**
   - Place bids on listings
   - Real-time bid updates (SignalR)
   - Bid history

3. **Messaging System**
   - Chat between buyers and sellers
   - Notifications
   - Unread message indicators

4. **Image Upload**
   - AWS S3 integration
   - Image optimization
   - Multiple image support

5. **Payment Integration**
   - Stripe or PayPal
   - Secure checkout
   - Order tracking

6. **Search & Filters**
   - Advanced search
   - Category filters
   - Price range filters
   - Sort options

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker ps`
- Check connection string in appsettings.json
- Verify port 5432 is not in use

### Frontend Build Errors
- Clear .next folder: `rm -r .next`
- Delete node_modules and reinstall: `rm -r node_modules; npm install`
- Check Node.js version: `node --version` (should be 20+)

### Backend API Errors
- Check .NET SDK version: `dotnet --version`
- Rebuild solution: `dotnet clean; dotnet build`
- Check migrations: `dotnet ef migrations list`

## 📞 Support

If you encounter any issues, please check the README.md or open an issue on GitHub.
