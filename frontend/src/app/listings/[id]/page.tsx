"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuctionTimer } from "@/components/AuctionTimer"
import { getListing, Listing, deleteListing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Package, User, Tag, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ListingDetailPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isOwner = user && listing && user.id === listing.seller.id

  useEffect(() => {
    async function loadListing() {
      const data = await getListing(listingId)
      setListing(data)
      setLoading(false)
    }
    loadListing()
  }, [listingId])

  const nextImage = () => {
    if (listing && listing.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.imageUrls.length)
    }
  }

  const previousImage = () => {
    if (listing && listing.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.imageUrls.length) % listing.imageUrls.length)
    }
  }

  const handleDelete = async () => {
    if (!user || !listing) return

    setIsDeleting(true)
    setDeleteError(null)

    const result = await deleteListing(listing.id, user.id)

    if (result.success) {
      // Redirect to home page after successful deletion
      router.push('/')
    } else {
      setDeleteError(result.message || t('deleteError'))
      setIsDeleting(false)
    }
  }

  const getDeleteMessage = () => {
    if (!listing) return ''
    
    const bidCount = listing.bidCount || 0
    
    if (bidCount === 0) {
      return t('deleteNoBidsMessage')
    }
    
    return t('deleteWithBidsMessage').replace('{count}', String(bidCount))
  }

  const canDelete = () => {
    if (!listing) return false
    
    const bidCount = listing.bidCount || 0
    if (bidCount === 0) return true
    
    // Check if ends within 24 hours
    if (listing.endDate) {
      const hoursRemaining = (new Date(listing.endDate).getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursRemaining < 24) return false
    }
    
    return true
  }

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

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{t("listingNotFound")}</h1>
            <p className="text-muted-foreground">{t("listingNotFoundDescription")}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center rounded-lg overflow-hidden relative">
                    {listing.imageUrls.length > 0 ? (
                      <>
                        <Image
                          src={listing.imageUrls[currentImageIndex]}
                          alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* Navigation Arrows */}
                        {listing.imageUrls.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={previousImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                              type="button"
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                              aria-label="Next image"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </button>
                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                              {currentImageIndex + 1} / {listing.imageUrls.length}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Thumbnail Gallery */}
              {listing.imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {listing.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={url}
                          alt={`${listing.title} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {listing.price.toLocaleString('is-IS')}
                  </span>
                  <span className="text-lg text-muted-foreground">{t("currency")}</span>
                </div>
                {listing.buyNowPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("buyNowPrice")}: {listing.buyNowPrice.toLocaleString('is-IS')} {t("currency")}
                  </p>
                )}
              </div>

              {/* Auction Timer */}
              {listing.listingType === 'Auction' && listing.endDate && (
                <Card>
                  <CardContent className="p-4">
                    <AuctionTimer endDate={listing.endDate} variant="large" />
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">{t("category")}</p>
                    <p className="font-medium">{t(listing.category)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">{t("condition")}</p>
                    <p className="font-medium">{listing.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">{t("seller")}</p>
                    <Link 
                      href={`/profile/${listing.seller.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {listing.seller.firstName} {listing.seller.lastName}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">{t("listed")}</p>
                    <p className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString('is-IS')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bidding Info */}
              {listing.listingType === "Auction" && !isOwner && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{t("currentBid")}</span>
                      <span className="font-bold">
                        {listing.highestBid 
                          ? `${listing.highestBid.toLocaleString('is-IS')} ${t("currency")}`
                          : t("noBids")
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">{t("totalBids")}</span>
                      <span className="font-medium">{listing.bidCount}</span>
                    </div>
                    {listing.endDate && (
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-muted-foreground">{t("endsOn")}</span>
                        <span className="font-medium">
                          {new Date(listing.endDate).toLocaleString('is-IS')}
                        </span>
                      </div>
                    )}
                    <Button className="w-full" size="lg">
                      {t("placeBid")}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Buy Now Button */}
              {listing.listingType === "BuyNow" && !isOwner && (
                <Button className="w-full" size="lg">
                  {t("buyNow")}
                </Button>
              )}

              {/* Delete Button - Only visible to the seller */}
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full gap-2" 
                      disabled={!canDelete()}
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("deleteListing")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {!canDelete() ? t("deleteBlockedMessage") : getDeleteMessage()}
                        {deleteError && (
                          <p className="text-destructive mt-2">{deleteError}</p>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancelAction")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting || !canDelete()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? t("loading") : (listing.bidCount > 0 ? t("confirmCancel") : t("confirmDelete"))}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Description */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("description")}</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description}
              </p>
            </CardContent>
          </Card>
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
