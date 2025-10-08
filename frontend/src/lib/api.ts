const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5075/api'

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
  listingType?: string
  page?: number
  pageSize?: number
}): Promise<{ listings: Listing[]; totalCount: number }> {
  const queryParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })
  }

  const url = `${API_URL}/listings${queryParams.toString() ? `?${queryParams}` : ''}`
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 10 } // Cache for 10 seconds
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`)
    }
    
    const listings = await response.json()
    const totalCount = parseInt(response.headers.get('X-Total-Count') || '0')

    return { listings, totalCount }
  } catch (error) {
    console.error('Error fetching listings:', error)
    return { listings: [], totalCount: 0 }
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const response = await fetch(`${API_URL}/listings/${id}`, {
      next: { revalidate: 10 }
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

export async function getEndingSoonAuctions(count: number = 6): Promise<Listing[]> {
  try {
    const response = await fetch(`${API_URL}/listings/ending-soon?count=${count}`, {
      next: { revalidate: 30 } // Cache for 30 seconds (auctions change frequently)
    })
    
    if (!response.ok) {
      // Fallback to regular listings filtered for auctions if endpoint doesn't exist yet
      const result = await getListings({ pageSize: count })
      return result.listings.filter(l => l.listingType === 'Auction' && l.endDate).slice(0, count)
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching ending soon auctions:', error)
    return []
  }
}

export async function getFeaturedListings(count: number = 10): Promise<Listing[]> {
  try {
    const response = await fetch(`${API_URL}/listings/featured?count=${count}`, {
      next: { revalidate: 60 } // Cache for 1 minute
    })
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching featured listings:', error)
    return []
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/listings/categories`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function createListing(listing: {
  title: string
  description: string
  price: number
  buyNowPrice?: number
  category: string
  condition: string
  imageUrls: string[]
  listingType: string
  isFeatured: boolean
  endDate?: string
  sellerId: string
}): Promise<Listing | null> {
  try {
    const response = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listing),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to create listing: ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    console.error('Error creating listing:', error)
    return null
  }
}

export async function deleteListing(listingId: string, sellerId: string): Promise<{
  success: boolean
  message?: string
  cancelled?: boolean
  deleted?: boolean
  bidCount?: number
}> {
  try {
    const response = await fetch(`${API_URL}/listings/${listingId}?sellerId=${sellerId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      return {
        success: false,
        message: error.message || 'Failed to delete listing'
      }
    }
    
    const result = await response.json()
    return {
      success: true,
      ...result
    }
  } catch (error) {
    console.error('Error deleting listing:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the listing'
    }
  }
}

// Auth Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  profileImageUrl?: string
  bio?: string
  address?: string
  city?: string
  postalCode?: string
  averageRating: number
  totalRatings: number
  totalSales: number
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  reviewer: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  listingId?: string
}

// Auth Functions
export async function register(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Registration failed')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error registering:', error)
    throw error
  }
}

export async function login(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Login failed')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export async function googleAuth(data: {
  email: string
  googleId: string
  firstName?: string
  lastName?: string
  profileImageUrl?: string
}): Promise<AuthResponse | null> {
  try {
    console.log('Attempting Google auth with data:', { ...data, googleId: 'HIDDEN' })
    console.log('API URL:', `${API_URL}/auth/google`)
    
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const error = await response.text()
      console.error('API error response:', error)
      throw new Error(error || 'Google authentication failed')
    }
    
    const result = await response.json()
    console.log('Auth successful')
    return result
  } catch (error) {
    console.error('Error with Google auth:', error)
    throw error
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`)
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function getUserListings(userId: string): Promise<Listing[]> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/listings`)
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching user listings:', error)
    return []
  }
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/reviews`)
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
}

export async function createReview(reviewerId: string, data: {
  rating: number
  comment: string
  reviewedUserId: string
  listingId?: string
}): Promise<Review | null> {
  try {
    const response = await fetch(`${API_URL}/users/${reviewerId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error creating review:', error)
    return null
  }
}

export async function updateProfile(userId: string, data: {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  bio?: string
  address?: string
  city?: string
  postalCode?: string
  profileImageUrl?: string
}): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating profile:', error)
    return null
  }
}
