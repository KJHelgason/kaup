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
import { Star, MapPin, Phone, Mail, Calendar, Package, MessageSquare, Edit } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings")

  const isOwnProfile = currentUser?.id === userId

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
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground text-3xl md:text-4xl font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
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

                      {/* Stats */}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{user.totalSales} {t("sales")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{t("joined")} {new Date(user.createdAt).toLocaleDateString('is-IS', { year: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Button (own profile only) */}
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        onClick={() => router.push("/account")}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("editProfile")}
                      </Button>
                    )}
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-muted-foreground mb-4">{user.bio}</p>
                  )}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
                {t("listings")} ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("reviews")} ({reviews.length})
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
          ) : (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t("noReviews")}</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {review.reviewer.firstName} {review.reviewer.lastName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(review.createdAt).toLocaleDateString('is-IS', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              )}
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
