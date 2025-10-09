"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { getWatchlist, removeFromWatchlist, WatchlistItem } from "@/lib/api"
import { Header } from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function WatchlistPage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    fetchWatchlist()
  }, [isAuthenticated])

  const fetchWatchlist = async () => {
    setLoading(true)
    const items = await getWatchlist()
    setWatchlistItems(items)
    setLoading(false)
  }

  const handleRemove = async (listingId: string, itemId: string) => {
    setRemovingId(itemId)
    const success = await removeFromWatchlist(listingId)
    if (success) {
      setWatchlistItems(watchlistItems.filter(item => item.id !== itemId))
      toast.success(t('removedFromWatchlist'))
      // Trigger event to update watchlist hearts on other pages
      window.dispatchEvent(new Event('watchlist-updated'))
    } else {
      toast.error('Failed to remove from watchlist')
    }
    setRemovingId(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default">Active</Badge>
      case 'Sold':
        return <Badge variant="secondary">Sold</Badge>
      case 'Expired':
        return <Badge variant="outline">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTimeRemaining = (endDate?: string) => {
    if (!endDate) return null
    
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8" />
            {t('myWatchlist')}
          </h1>
          <div className="text-muted-foreground">
            {watchlistItems.length} {watchlistItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {watchlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{t('emptyWatchlist')}</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding items to your watchlist to keep track of them.
                </p>
                <Link href="/">
                  <Button>
                    Browse Listings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {watchlistItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/listings/${item.listingId}`}>
                      <div className="w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.listingImageUrl ? (
                          <img
                            src={item.listingImageUrl}
                            alt={item.listingTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/listings/${item.listingId}`}>
                            <h3 className="font-semibold text-lg hover:underline line-clamp-2 mb-1">
                              {item.listingTitle}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">
                            Sold by {item.sellerName}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {getStatusBadge(item.listingStatus)}
                            <Badge variant="outline">{item.listingType}</Badge>
                            {item.listingType === 'Auction' && item.bidCount > 0 && (
                              <Badge variant="secondary">{item.bidCount} bids</Badge>
                            )}
                          </div>

                          {item.listingType === 'Auction' && item.endDate && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatTimeRemaining(item.endDate)}
                            </div>
                          )}
                        </div>

                        {/* Price and Remove Button */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-2xl font-bold">
                            {item.listingPrice.toLocaleString()} kr
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(item.listingId, item.id)}
                            disabled={removingId === item.id}
                            className="text-destructive hover:text-destructive"
                          >
                            <Heart className="h-4 w-4 mr-1 fill-current" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      {/* Added date */}
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
