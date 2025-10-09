"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuctionTimer } from "@/components/AuctionTimer"
import { getListing, Listing, deleteListing, createOffer, toggleFeaturedListing, addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlistCount, getBidsByListing, placeBid, Bid, addToCart } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Package, User, Tag, ChevronLeft, ChevronRight, Trash2, Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  
  // Offer modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [offerAmount, setOfferAmount] = useState("")
  const [offerMessage, setOfferMessage] = useState("")
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [offerError, setOfferError] = useState<string | null>(null)
  const [offerSuccess, setOfferSuccess] = useState(false)
  
  // Feature toggle state
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)
  
  // Watchlist state
  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistCount, setWatchlistCount] = useState(0)
  const [isTogglingWatchlist, setIsTogglingWatchlist] = useState(false)

  // Bid state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [bidError, setBidError] = useState<string | null>(null)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [bids, setBids] = useState<Bid[]>([])
  const [loadingBids, setLoadingBids] = useState(false)

  // Cart state
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isOwner = user && listing && user.id === listing.seller.id
  const isAdmin = user?.isAdmin || false

  useEffect(() => {
    async function loadListing() {
      const data = await getListing(listingId)
      setListing(data)
      setLoading(false)
    }
    loadListing()
  }, [listingId])

  useEffect(() => {
    async function loadWatchlistData() {
      if (listingId) {
        // Get watchlist count (public)
        const count = await getWatchlistCount(listingId)
        setWatchlistCount(count)

        // Check if current user has it in watchlist (requires auth)
        if (user) {
          const inList = await isInWatchlist(listingId)
          setInWatchlist(inList)
        }
      }
    }
    loadWatchlistData()
  }, [listingId, user])

  useEffect(() => {
    async function loadBids() {
      if (listingId && listing?.listingType === 'Auction') {
        setLoadingBids(true)
        const bidData = await getBidsByListing(listingId)
        setBids(bidData)
        setLoadingBids(false)
      }
    }
    loadBids()
  }, [listingId, listing?.listingType])

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

  const handleSubmitOffer = async () => {
    if (!listing || !user) return

    setOfferError(null)
    const amount = parseFloat(offerAmount)

    // Validation
    if (!amount || amount <= 0) {
      setOfferError(t("offerTooLow"))
      return
    }

    if (amount >= listing.price) {
      setOfferError(t("offerTooHigh"))
      return
    }

    setIsSubmittingOffer(true)

    try {
      await createOffer(listing.id, amount, offerMessage || undefined)
      setOfferSuccess(true)
      setOfferAmount("")
      setOfferMessage("")
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOfferModalOpen(false)
        setOfferSuccess(false)
      }, 2000)
    } catch (error: any) {
      setOfferError(error.message || t("offerError"))
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  const handleToggleFeatured = async () => {
    if (!listing || !isAdmin) return

    setIsTogglingFeatured(true)

    try {
      await toggleFeaturedListing(listing.id, !listing.isFeatured)
      // Update local state
      setListing({ ...listing, isFeatured: !listing.isFeatured })
    } catch (error) {
      console.error('Error toggling featured status:', error)
    } finally {
      setIsTogglingFeatured(false)
    }
  }

  const handleToggleWatchlist = async () => {
    if (!listing || !user) return

    setIsTogglingWatchlist(true)

    try {
      if (inWatchlist) {
        await removeFromWatchlist(listing.id)
        setInWatchlist(false)
        setWatchlistCount(prev => Math.max(0, prev - 1))
      } else {
        await addToWatchlist(listing.id)
        setInWatchlist(true)
        setWatchlistCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setIsTogglingWatchlist(false)
    }
  }

  const handleSubmitBid = async () => {
    if (!listing || !user) return

    setBidError(null)
    const amount = parseFloat(bidAmount)

    // Validation
    if (!amount || amount <= 0) {
      setBidError(t("bidTooLow"))
      return
    }

    const currentHighest = listing.highestBid || listing.price
    if (amount <= currentHighest) {
      setBidError(`${t("bidMustBeHigher")} ${currentHighest.toLocaleString('is-IS')} ${t("currency")}`)
      return
    }

    setIsSubmittingBid(true)

    const result = await placeBid(listing.id, amount)

    if (result.success && result.bid) {
      // Success!
      setBidSuccess(true)
      setBidAmount("")
      
      // Update listing with new bid data
      setListing({
        ...listing,
        bidCount: listing.bidCount + 1,
        highestBid: amount
      })

      // Add new bid to the list
      setBids([result.bid, ...bids])
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsBidModalOpen(false)
        setBidSuccess(false)
      }, 2000)
    } else {
      setBidError(result.error || t("bidError"))
    }

    setIsSubmittingBid(false)
  }

  const handleAddToCart = async () => {
    if (!listing || !user) return

    setIsAddingToCart(true)

    const result = await addToCart(listing.id)

    if (result.success) {
      toast.success(t("addedToCart"), {
        description: listing.title,
        action: {
          label: t("cart"),
          onClick: () => router.push('/cart')
        }
      })
      // Trigger a storage event to update header cart count
      window.dispatchEvent(new Event('cart-updated'))
    } else {
      toast.error(result.error || t("addToCartError"))
    }

    setIsAddingToCart(false)
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
              <Card className="p-0">
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
                        
                        {/* Watchlist Heart with Count - Top Right */}
                        {user && (
                          <button
                            type="button"
                            onClick={handleToggleWatchlist}
                            disabled={isTogglingWatchlist}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="text-sm font-medium text-muted-foreground">
                              {watchlistCount}
                            </span>
                            <Heart 
                              className={`h-5 w-5 transition-colors ${
                                inWatchlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                              }`}
                            />
                          </button>
                        )}

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
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold mb-3">{listing.title}</h1>
                <div className="border-b"></div>
              </div>

              {/* Seller Info - eBay Style */}
              <div className="flex items-start gap-3">
                {/* Seller Avatar */}
                <Link 
                  href={`/profile/${listing.seller.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {listing.seller.profileImageUrl ? (
                    <Image
                      src={listing.seller.profileImageUrl}
                      alt={listing.seller.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </Link>

                {/* Seller Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      href={`/profile/${listing.seller.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                    >
                      {listing.seller.username}
                    </Link>
                    <span className="text-sm text-muted-foreground">(0)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
                    <Link 
                      href={`/profile/${listing.seller.username}?tab=feedback`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium underline"
                    >
                      100% {t("positive")}
                    </Link>
                    <span>•</span>
                    <Link 
                      href={`/profile/${listing.seller.username}?tab=listings`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {t("sellerOtherItems")}
                    </Link>
                    {!isOwner && (
                      <>
                        <span>•</span>
                        <Link 
                          href={`/messages?userId=${listing.seller.id}&listingId=${listing.id}`}
                          className="underline"
                        >
                          {t("contactSeller")}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider after seller */}
              <div className="border-b"></div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {(listing.listingType === 'Auction' && listing.highestBid 
                      ? listing.highestBid 
                      : listing.price
                    ).toLocaleString('is-IS')}
                  </span>
                  <span className="text-lg text-muted-foreground">{t("currency")}</span>
                </div>
                
                {/* Auction Info - Starting price if there are bids */}
                {listing.listingType === 'Auction' && listing.highestBid && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {t("startingPrice")}: {listing.price.toLocaleString('is-IS')} {t("currency")}
                  </div>
                )}
                
                {/* Auction Info - Bids and End Time */}
                {listing.listingType === 'Auction' && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span>
                      {listing.bidCount} {listing.bidCount === 1 ? t("bid") : t("bids")}
                    </span>
                    {listing.endDate && (
                      <>
                        <span>•</span>
                        <span>
                          {t("endsOn")} {new Date(listing.endDate).toLocaleString('is-IS', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Divider after price */}
              <div className="border-b"></div>

              {/* Auction Timer */}
              {listing.listingType === 'Auction' && listing.endDate && (
                <div>
                  <AuctionTimer endDate={listing.endDate} variant="large" />
                </div>
              )}

              {/* Divider before buttons */}
              {listing.listingType === 'Auction' && listing.endDate && !isOwner && (
                <div className="border-b"></div>
              )}

              {/* Bidding Buttons */}
              {listing.listingType === "Auction" && !isOwner && (
                <>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setIsBidModalOpen(true)}
                  >
                    {t("placeBid")}
                  </Button>
                  
                  {/* Buy It Now button - only show if no bids yet and buyNowPrice exists */}
                  {listing.buyNowPrice && listing.bidCount === 0 && (
                    <Button className="w-full" size="lg">
                      {t("buyNow")} - {listing.buyNowPrice.toLocaleString('is-IS')} {t("currency")}
                    </Button>
                  )}
                </>
              )}

              {/* Buy Now Button - For Fixed Price Listings */}
              {listing.listingType === "BuyNow" && !isOwner && (
                <>
                  <Button className="w-full" size="lg">
                    {t("buyNow")}
                  </Button>
                  
                  {/* Add to Cart Button */}
                  {user && (
                    <Button 
                      variant="outline"
                      className="w-full gap-2" 
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {isAddingToCart ? t("loading") : t("addToCart")}
                    </Button>
                  )}
                </>
              )}

              {/* Make Offer Button - When seller accepts offers */}
              {listing.acceptOffers && !isOwner && (
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsOfferModalOpen(true)}
                >
                  {t("makeOffer")}
                </Button>
              )}

              {/* Add to Watchlist Button - Visible to all authenticated users except owner */}
              {!isOwner && user && (
                <Button 
                  variant={inWatchlist ? "default" : "outline"}
                  className="w-full gap-2" 
                  size="lg"
                  onClick={handleToggleWatchlist}
                  disabled={isTogglingWatchlist}
                >
                  <Heart className={`h-5 w-5 ${inWatchlist ? "fill-current" : ""}`} />
                  {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
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

              {/* Feature Listing Button - Only visible to admins */}
              {isAdmin && (
                <Button 
                  variant={listing.isFeatured ? "default" : "outline"} 
                  className="w-full gap-2" 
                  onClick={handleToggleFeatured}
                  disabled={isTogglingFeatured}
                >
                  <Star className={`h-4 w-4 ${listing.isFeatured ? "fill-current" : ""}`} />
                  {isTogglingFeatured 
                    ? t("loading") 
                    : listing.isFeatured 
                      ? "Remove from Featured" 
                      : "Add to Featured"
                  }
                </Button>
              )}
            </div>
          </div>

          {/* Tabs - About this item & Bid History */}
          <div className="mt-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="inline-flex h-auto p-0 bg-transparent rounded-none border-b-0">
                <TabsTrigger 
                  value="about"
                  className={`bg-card border border-b-0 px-6 py-3 data-[state=active]:bg-card data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground rounded-b-none ${
                    listing.listingType === 'Auction' ? 'rounded-tl-lg rounded-tr-none' : 'rounded-t-lg'
                  }`}
                >
                  {t("aboutThisItem")}
                </TabsTrigger>
                {listing.listingType === 'Auction' && (
                  <TabsTrigger 
                    value="bids"
                    className="bg-card border border-b-0 border-l-0 rounded-tr-lg rounded-tl-none px-6 py-3 data-[state=active]:bg-card data-[state=inactive]:bg-muted/50 data-[state=inactive]:text-muted-foreground rounded-b-none"
                  >
                    {t("bidHistory")} {listing.bidCount > 0 && `(${listing.bidCount})`}
                  </TabsTrigger>
                )}
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-0">
                <Card className="rounded-tl-none border-t py-0">
                  <CardContent className="p-6">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">{t("listed")}</p>
                          <p className="font-medium">
                            {new Date(listing.createdAt).toLocaleDateString('is-IS')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase">{t("description")}</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {listing.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bid History Tab */}
              {listing.listingType === 'Auction' && (
                <TabsContent value="bids" className="mt-0">
                  <Card className="rounded-tl-none border-t py-0">
                    <CardContent className="p-6">
                      {loadingBids ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {t("loading")}...
                        </div>
                      ) : bids.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {t("noBidsYet")}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bids.map((bid, index) => (
                            <div 
                              key={bid.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                              }`}
                            >
                              <Link 
                                href={`/profile/${bid.bidder.id}`}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                              >
                                {bid.bidder.profileImageUrl ? (
                                  <Image
                                    src={bid.bidder.profileImageUrl}
                                    alt={bid.bidder.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium hover:underline">
                                    {bid.bidder.username}
                                    {index === 0 && (
                                      <span className="ml-2 text-xs font-semibold text-primary">
                                        {t("highestBid")}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(bid.createdAt).toLocaleString('is-IS', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </Link>
                              <div className="text-right">
                                <p className="font-bold text-lg">
                                  {bid.amount.toLocaleString('is-IS')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {t("currency")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>

      {/* Make Offer Modal */}
      <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("makeOffer")}</DialogTitle>
            <DialogDescription>
              {listing && (
                <>
                  {t("makeOffer")} - {listing.title}
                  <br />
                  {t("price")}: {listing.price.toLocaleString('is-IS')} {t("currency")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {offerSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-600 text-xl font-semibold mb-2">
                {t("offerSubmitted")}
              </div>
              <p className="text-muted-foreground">
                {t("offerSubmittedMessage")}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="offerAmount">
                    {t("offerAmount")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="offerAmount"
                      type="number"
                      placeholder="0"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      min="0"
                      step="100"
                      disabled={isSubmittingOffer}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t("currency")}
                    </span>
                  </div>
                  {listing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("price")}: {listing.price.toLocaleString('is-IS')} {t("currency")}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="offerMessage">
                    {t("offerMessage")}
                  </Label>
                  <textarea
                    id="offerMessage"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t("offerMessagePlaceholder")}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    maxLength={500}
                    disabled={isSubmittingOffer}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {offerMessage.length}/500 {t("characters")}
                  </p>
                </div>

                {offerError && (
                  <div className="text-sm text-destructive">
                    {offerError}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOfferModalOpen(false)}
                  disabled={isSubmittingOffer}
                >
                  {t("cancelAction")}
                </Button>
                <Button
                  onClick={handleSubmitOffer}
                  disabled={isSubmittingOffer || !offerAmount}
                >
                  {isSubmittingOffer ? t("loading") : t("submitOffer")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Place Bid Modal */}
      <Dialog open={isBidModalOpen} onOpenChange={setIsBidModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("placeBid")}</DialogTitle>
            <DialogDescription>
              {listing && (
                <>
                  {listing.title}
                  <br />
                  {t("currentPrice")}: {(listing.highestBid || listing.price).toLocaleString('is-IS')} {t("currency")}
                  {listing.bidCount > 0 && (
                    <>
                      <br />
                      <span className="text-xs">
                        {listing.bidCount} {listing.bidCount === 1 ? t("bid") : t("bids")}
                      </span>
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {bidSuccess ? (
            <div className="py-8 text-center">
              <div className="text-green-600 text-xl font-semibold mb-2">
                ✓ {t("bidPlaced")}
              </div>
              <p className="text-muted-foreground">
                {t("bidPlacedMessage")}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="bidAmount">
                    {t("yourBid")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="bidAmount"
                      type="number"
                      placeholder="0"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min="0"
                      step="100"
                      disabled={isSubmittingBid}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t("currency")}
                    </span>
                  </div>
                  {listing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("minimumBid")}: {((listing.highestBid || listing.price) + 100).toLocaleString('is-IS')} {t("currency")}
                    </p>
                  )}
                </div>

                {bidError && (
                  <div className="text-sm text-destructive">
                    {bidError}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBidModalOpen(false)}
                  disabled={isSubmittingBid}
                >
                  {t("cancelAction")}
                </Button>
                <Button
                  onClick={handleSubmitBid}
                  disabled={isSubmittingBid || !bidAmount}
                >
                  {isSubmittingBid ? t("loading") : t("confirmBid")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
