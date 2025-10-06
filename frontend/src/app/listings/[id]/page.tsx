"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getListing, Listing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, Package, User, Tag } from "lucide-react"

export default function ListingDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const listingId = params.id as string
  
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListing() {
      const data = await getListing(listingId)
      setListing(data)
      setLoading(false)
    }
    loadListing()
  }, [listingId])

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
            <div>
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center rounded-lg overflow-hidden">
                    {listing.imageUrls.length > 0 ? (
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
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
                    <p className="font-medium">
                      {listing.seller.firstName} {listing.seller.lastName}
                    </p>
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
              {listing.listingType === "Auction" && (
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
              {listing.listingType === "BuyNow" && (
                <Button className="w-full" size="lg">
                  {t("buyNow")}
                </Button>
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
