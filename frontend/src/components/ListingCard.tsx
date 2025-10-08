import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Listing } from "@/lib/api"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const { t } = useLanguage()
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {/* Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
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
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">
          {listing.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {listing.description}
        </p>
        
        {/* Price and Bids */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {listing.price.toLocaleString('is-IS')}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              {t('currency')}
            </span>
          </div>
          
          {listing.bidCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {listing.bidCount} {listing.bidCount === 1 ? 'boð' : 'boð'}
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="mt-2">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
            {t(listing.category)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={`/listings/${listing.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            {t('viewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
