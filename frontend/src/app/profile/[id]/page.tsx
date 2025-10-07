"use client"

import { Header } from "@/components/Header"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser, getUserListings, getUserReviews, User, Listing, Review } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, Phone, Mail, Calendar, Package, MessageSquare, Edit, User as UserIcon } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user: currentUser } = useAuth()
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"listings" | "about" | "feedback">("listings")

  const isOwnProfile = currentUser?.id === userId

  // Calculate positive feedback percentage
  const getPositiveFeedbackPercentage = () => {
    if (!user || user.totalRatings === 0) return 100
    const positiveCount = reviews.filter(r => r.rating >= 4).length
    return Math.round((positiveCount / reviews.length) * 100)
  }

  const getFeedbackStats = () => {
    const now = new Date()
    const last12Months = new Date(now.setFullYear(now.getFullYear() - 1))
    
    const recentReviews = reviews.filter(r => new Date(r.createdAt) >= last12Months)
    
    const positive = recentReviews.filter(r => r.rating >= 4).length
    const neutral = recentReviews.filter(r => r.rating === 3).length
    const negative = recentReviews.filter(r => r.rating <= 2).length
    
    return { positive, neutral, negative, total: recentReviews.length }
  }

  const getTimePeriod = (date: string) => {
    const reviewDate = new Date(date)
    const now = new Date()
    const diffMonths = (now.getFullYear() - reviewDate.getFullYear()) * 12 + 
                       (now.getMonth() - reviewDate.getMonth())
    
    if (diffMonths < 1) return t("pastMonth")
    if (diffMonths < 6) return t("past6Months")
    return t("pastYear")
  }

  useEffect(() => {
    async function loadProfile() {
      const [userData, userListings, userReviews] = await Promise.all([
        getUser(userId),
        getUserListings(userId),
        getUserReviews(userId)
      ])
      
      setUser(userData)
      setListings(userListings)
      setReviews(userReviews)
      setLoading(false)
    }
    
    loadProfile()
  }, [userId])

  // Sync with currentUser if viewing own profile
  useEffect(() => {
    if (isOwnProfile && currentUser && user) {
      // Update profile image if it changed in currentUser (from account page save)
      if (currentUser.profileImageUrl !== user.profileImageUrl) {
        setUser(prev => prev ? { ...prev, profileImageUrl: currentUser.profileImageUrl } : prev)
      }
    }
  }, [currentUser, isOwnProfile, user])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t("loading")}</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{t("userNotFound")}</h1>
            <p className="text-muted-foreground">{t("userNotFoundDescription")}</p>
          </div>
        </main>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.profileImageUrl ? (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background shadow-lg relative">
                      <Image
                        src={user.profileImageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground text-3xl md:text-4xl font-bold shadow-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {user.firstName} {user.lastName}
                      </h1>
                      
                      {/* Rating */}
                      {user.totalRatings > 0 ? (
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(Math.round(user.averageRating))}
                          <span className="font-semibold">{user.averageRating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({user.totalRatings} {user.totalRatings === 1 ? t("review") : t("reviews")})
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-3">{t("noReviewsYet")}</p>
                      )}

                      {/* eBay-Style Stats Banner */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 font-medium">
                          <span>{getPositiveFeedbackPercentage()}% {t("positiveFeedback")}</span>
                          <span className="text-muted-foreground">({user.totalRatings})</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="font-medium">
                          <span>{user.totalSales} {t("itemsSold")}</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="font-medium text-muted-foreground">
                          <span>0 {t("followers")}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {t("share")}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t("contact")}
                        </Button>
                        <Button variant="outline" size="sm">
                          {t("save")}
                        </Button>
                      </div>
                    </div>

                    {/* Edit Button (own profile only) - moved to top right */}
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        onClick={() => router.push("/account")}
                        className="absolute top-0 right-0"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("editProfile")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab("listings")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "listings"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("listings")}
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "about"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("about")}
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "feedback"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("feedback")}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "listings" ? (
            <div>
              {listings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isOwnProfile ? t("noListingsYet") : t("noListingsFromUser")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "about" ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("about")}</h2>
                
                {/* Bio */}
                {user.bio && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2 text-sm text-muted-foreground">{t("bio")}</h3>
                    <p className="text-foreground">{user.bio}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">{t("contactInformation")}</h3>
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  {(user.city || user.address) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {user.address && `${user.address}, `}
                        {user.city}
                        {user.postalCode && ` ${user.postalCode}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t("joined")} {new Date(user.createdAt).toLocaleDateString('is-IS', { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Feedback Tab
            <div className="space-y-6">
              {/* Feedback Ratings Summary - Horizontal Layout */}
              <Card>
                <CardContent>
                  <div className="flex items-stretch gap-6">
                    {/* Left Side: Feedback Ratings (30%) */}
                    <div className="w-[30%]">
                        <div className="mb-3">
                            <div className="text-lg font-semibold">{t("feedbackRatings")}</div>
                            <div className="text-sm text-muted-foreground">{t("last12Months")}</div>
                        </div>
                      <div className="grid grid-cols-3 gap-6">
                        {/* Positive */}
                        <div className="text-center">
                          <div className="text-sm font-semibold mb-2">{t("positive")}</div>
                          <div className="text-4xl font-bold text-green-600 mb-1">
                            {getFeedbackStats().positive}
                          </div>
                        </div>
                        
                        {/* Neutral */}
                        <div className="text-center">
                          <div className="text-sm font-semibold mb-2">{t("neutral")}</div>
                          <div className="text-4xl font-bold text-yellow-600 mb-1">
                            {getFeedbackStats().neutral}
                          </div>
                        </div>
                        
                        {/* Negative */}
                        <div className="text-center">
                          <div className="text-sm font-semibold mb-2">{t("negative")}</div>
                          <div className="text-4xl font-bold text-red-600 mb-1">
                            {getFeedbackStats().negative}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px bg-border" />

                    {/* Right Side: Detailed Seller Ratings (70%) */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <div className="text-lg font-semibold">{t("detailedSellerRatings")}</div>
                        <div className="text-sm text-muted-foreground">{t("averageForLast12Months")}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {/* Accurate Description */}
                        <div className="flex items-center gap-2">
                          <div className="text-xs w-32 flex-shrink-0">{t("accurateDescription")}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${(5.0 / 5) * 100}%` }} />
                          </div>
                          <div className="text-sm font-semibold w-8 text-right flex-shrink-0">5.0</div>
                        </div>

                        {/* Communication */}
                        <div className="flex items-center gap-2">
                          <div className="text-xs w-32 flex-shrink-0">{t("communication")}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${(5.0 / 5) * 100}%` }} />
                          </div>
                          <div className="text-sm font-semibold w-8 text-right flex-shrink-0">5.0</div>
                        </div>

                        {/* Shipping Cost */}
                        <div className="flex items-center gap-2">
                          <div className="text-xs w-32 flex-shrink-0">{t("reasonableShippingCost")}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${(4.8 / 5) * 100}%` }} />
                          </div>
                          <div className="text-sm font-semibold w-8 text-right flex-shrink-0">4.8</div>
                        </div>

                        {/* Shipping Speed */}
                        <div className="flex items-center gap-2">
                          <div className="text-xs w-32 flex-shrink-0">{t("shippingSpeed")}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: `${(4.8 / 5) * 100}%` }} />
                          </div>
                          <div className="text-sm font-semibold w-8 text-right flex-shrink-0">4.8</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* All Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("allFeedback")} ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">{t("noReviews")}</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.reviewer.firstName[0]}***{review.reviewer.lastName[0]}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({user.totalRatings})
                            </span>
                            <span className="text-sm text-muted-foreground">-</span>
                            <span className="text-sm text-muted-foreground">{t("feedbackLeftByBuyer")}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">{getTimePeriod(review.createdAt)}</div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-xs font-medium text-green-600">{t("verifiedPurchase")}</span>
                        </div>
                        <p className="text-foreground">{review.comment}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>
    </div>
  )
}
