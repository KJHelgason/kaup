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
  acceptOffers: boolean
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
  acceptOffers: boolean
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

export async function toggleFeaturedListing(listingId: string, isFeatured: boolean): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/listings/${listingId}/featured`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isFeatured }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to toggle featured status: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Error toggling featured status:', error)
    throw error
  }
}

// Watchlist Functions
export interface WatchlistItem {
  id: string
  listingId: string
  listingTitle: string
  listingPrice: number
  listingImageUrl?: string
  listingStatus: string
  listingType: string
  endDate?: string
  bidCount: number
  sellerName: string
  addedAt: string
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/watchlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return []
  }
}

export async function addToWatchlist(listingId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/watchlist/${listingId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add to watchlist')
    }
    
    return true
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    throw error
  }
}

export async function removeFromWatchlist(listingId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/watchlist/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to remove from watchlist')
    }
    
    return true
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    throw error
  }
}

export async function isInWatchlist(listingId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return false
    }

    const response = await fetch(`${API_URL}/watchlist/check/${listingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    
    if (!response.ok) {
      return false
    }
    
    return response.json()
  } catch (error) {
    console.error('Error checking watchlist:', error)
    return false
  }
}

export async function getWatchlistCount(listingId: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/watchlist/count/${listingId}`)
    
    if (!response.ok) {
      return 0
    }
    
    return response.json()
  } catch (error) {
    console.error('Error getting watchlist count:', error)
    return 0
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
  isAdmin: boolean
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

// Offers API
export interface Offer {
  id: string
  listingId: string
  listingTitle: string
  listingPrice: number
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  amount: number
  message?: string
  status: string // Pending, Accepted, Declined, Countered, Expired, Withdrawn
  parentOfferId?: string
  expiresAt: string
  createdAt: string
  respondedAt?: string
}

export async function createOffer(
  listingId: string,
  amount: number,
  message?: string
): Promise<Offer | null> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        listingId,
        amount,
        message,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create offer')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating offer:', error)
    throw error
  }
}

export async function getMyOffers(type: 'sent' | 'received'): Promise<Offer[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/offers/my-offers?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return []
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching offers:', error)
    return []
  }
}

export async function respondToOffer(
  offerId: string,
  action: 'accept' | 'decline' | 'counter',
  counterAmount?: number,
  counterMessage?: string
): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/offers/${offerId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        action,
        counterAmount,
        counterMessage,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to respond to offer')
    }
    
    return true
  } catch (error) {
    console.error('Error responding to offer:', error)
    throw error
  }
}

export async function withdrawOffer(offerId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_URL}/offers/${offerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to withdraw offer')
    }
    
    return true
  } catch (error) {
    console.error('Error withdrawing offer:', error)
    throw error
  }
}

// Notifications API
export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  linkUrl?: string
  relatedEntityId?: string
  isRead: boolean
  createdAt: string
}

export async function getNotifications(unreadOnly: boolean = false): Promise<Notification[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/notifications?unreadOnly=${unreadOnly}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return []
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return 0
    }

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return 0
    }
    
    const count = await response.json()
    return typeof count === 'number' ? count : (count.count || 0)
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return false
    }

    const response = await fetch(`${API_URL}/notifications/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notificationIds: [notificationId] }),
    })
    
    return response.ok
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return false
    }

    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    return response.ok
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}

// ==================== BIDDING ====================

export interface Bid {
  id: string
  amount: number
  createdAt: string
  listingId: string
  bidder: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
}

export async function getBidsByListing(listingId: string): Promise<Bid[]> {
  try {
    const response = await fetch(`${API_URL}/bids/listing/${listingId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch bids')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching bids:', error)
    return []
  }
}

export async function getMyBids(): Promise<Bid[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/bids/user/my-bids`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch my bids')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching my bids:', error)
    return []
  }
}

export async function placeBid(listingId: string, amount: number): Promise<{ success: boolean; bid?: Bid; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        listingId,
        amount,
      }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to place bid' }
    }
    
    return { success: true, bid: data }
  } catch (error) {
    console.error('Error placing bid:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function retractBid(bidId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/bids/${bidId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || 'Failed to retract bid' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error retracting bid:', error)
    return { success: false, error: 'Network error' }
  }
}

// ==================== CART ====================

export interface CartItem {
  id: string
  listingId: string
  listingTitle: string
  listingPrice: number
  listingImageUrl?: string
  listingStatus: string
  sellerName: string
  sellerId: string
  addedAt: string
}

export async function getCart(): Promise<CartItem[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return 0
    }

    const response = await fetch(`${API_URL}/cart/count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      return 0
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching cart count:', error)
    return 0
  }
}

export async function addToCart(listingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ listingId }),
    })
    
    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || 'Failed to add to cart' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function removeFromCart(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || 'Failed to remove from cart' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || 'Failed to clear cart' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Network error' }
  }
}

// Message Functions
export interface Conversation {
  userId: string
  userName: string
  userProfileImage?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  listingId?: string
  listingTitle?: string
}

export interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderProfileImage?: string
  receiverId: string
  receiverName: string
  isRead: boolean
  createdAt: string
  listingId?: string
  listingTitle?: string
  listingImageUrl?: string
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/messages/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return []
  }
}

export async function getConversation(otherUserId: string): Promise<Message[]> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return []
    }

    const response = await fetch(`${API_URL}/messages/conversation/${otherUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return []
  }
}

export async function sendMessage(receiverId: string, content: string, listingId?: string): Promise<{ success: boolean; message?: Message; error?: string }> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, content, listingId }),
    })

    if (!response.ok) {
      const data = await response.json()
      return { success: false, error: data.message || 'Failed to send message' }
    }

    const message = await response.json()
    return { success: true, message }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return 0
    }

    const response = await fetch(`${API_URL}/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      return await response.json()
    }
    return 0
  } catch (error) {
    console.error('Error fetching unread message count:', error)
    return 0
  }
}

export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return false
    }

    const response = await fetch(`${API_URL}/messages/${messageId}/mark-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error marking message as read:', error)
    return false
  }
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('kaup-token')
    if (!token) {
      return false
    }

    const response = await fetch(`${API_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error deleting message:', error)
    return false
  }
}

