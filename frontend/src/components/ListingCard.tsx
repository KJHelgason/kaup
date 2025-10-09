"use client"

import { Listing, addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/api"
import { AuctionTimer } from "@/components/AuctionTimer"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [inWatchlist, setInWatchlist] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      isInWatchlist(listing.id).then(setInWatchlist)
    }
  }, [isAuthenticated, listing.id])

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to listing detail
    e.stopPropagation()

    if (!isAuthenticated) {
      // Could show a login modal here
      return
    }

    setIsToggling(true)
    try {
      if (inWatchlist) {
        await removeFromWatchlist(listing.id)
        setInWatchlist(false)
      } else {
        await addToWatchlist(listing.id)
        setInWatchlist(true)
      }
    } catch (error) {
      console.error('Watchlist toggle error:', error)
    } finally {
      setIsToggling(false)
    }
  }
  
  return (
    <Link href={`/listings/${listing.id}`} className="group cursor-pointer block relative">
      <div className="space-y-3">
        {/* Square Image with Heart Button */}
        <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity relative">
          {listing.imageUrls.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.imageUrls[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-4xl">📦</div>
          )}
          
          {/* Heart Button */}
          {isAuthenticated && (
            <button
              onClick={handleWatchlistToggle}
              disabled={isToggling}
              className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors shadow-md"
              aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${
                  inWatchlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`} 
              />
            </button>
          )}
        </div>
        
        {/* Text Content */}
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          
          {/* Condition */}
          <p className="text-sm text-muted-foreground -mt-2">
            {t(listing.condition)}
          </p>
          
          {/* Price */}
          <div>
            <span className="text-xl font-bold text-primary">
              {listing.price.toLocaleString('is-IS')} {t('currency')}
            </span>
            {listing.acceptOffers && (
              <p className="text-sm text-muted-foreground">
                {t('orBestOffer')}
              </p>
            )}
          </div>
          
          {/* Auction Info: Bids and Timer */}
          {listing.listingType === 'Auction' && listing.endDate && (
            <div className="space-y-1 -mt-1">
              {listing.bidCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {listing.bidCount} {listing.bidCount === 1 ? t('bid') : t('bids')}
                </p>
              )}
              <AuctionTimer endDate={listing.endDate} variant="compact" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
