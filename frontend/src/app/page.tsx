"use client"

import { Header } from "@/components/Header"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { getFeaturedListings, getEndingSoonAuctions, Listing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"

export default function Home() {
  const { t } = useLanguage()
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [endingSoonAuctions, setEndingSoonAuctions] = useState<Listing[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [loadingAuctions, setLoadingAuctions] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const auctionScrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [canScrollLeftAuctions, setCanScrollLeftAuctions] = useState(false)
  const [canScrollRightAuctions, setCanScrollRightAuctions] = useState(false)

  useEffect(() => {
    async function loadListings() {
      setLoadingFeatured(true)
      const listings = await getFeaturedListings(8) // Load up to 8 for carousel
      setFeaturedListings(listings)
      setLoadingFeatured(false)
    }
    loadListings()
  }, [])

  useEffect(() => {
    async function loadAuctions() {
      setLoadingAuctions(true)
      const auctions = await getEndingSoonAuctions(8) // Load up to 8 for carousel
      setEndingSoonAuctions(auctions)
      setLoadingAuctions(false)
    }
    loadAuctions()
  }, [])

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const checkScrollAuctions = () => {
    if (auctionScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = auctionScrollContainerRef.current
      setCanScrollLeftAuctions(scrollLeft > 0)
      setCanScrollRightAuctions(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [featuredListings])

  useEffect(() => {
    checkScrollAuctions()
    const container = auctionScrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollAuctions)
      window.addEventListener('resize', checkScrollAuctions)
      return () => {
        container.removeEventListener('scroll', checkScrollAuctions)
        window.removeEventListener('resize', checkScrollAuctions)
      }
    }
  }, [endingSoonAuctions])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600 // Increased scroll distance
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const scrollAuctions = (direction: 'left' | 'right') => {
    if (auctionScrollContainerRef.current) {
      const scrollAmount = 600 // Increased scroll distance
      const newScrollLeft = direction === 'left' 
        ? auctionScrollContainerRef.current.scrollLeft - scrollAmount
        : auctionScrollContainerRef.current.scrollLeft + scrollAmount
      
      auctionScrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t("welcome")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/browse">
                <Button size="lg" className="text-lg px-8">
                  {t("browse")}
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t("sell")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Listings Section - MOVED TO TOP */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {t("featuredListings")}
              </h2>
              <Link href="/browse">
                <Button variant="outline">
                  {t("showMore")}
                </Button>
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="text-center py-12 text-muted-foreground">
                {t("loading")}
              </div>
            ) : featuredListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("noResults")}</p>
              </div>
            ) : (
              <div className="relative">
                {/* Scroll Left Button */}
                {featuredListings.length > 4 && canScrollLeft && (
                  <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Scroll Right Button */}
                {featuredListings.length > 4 && canScrollRight && (
                  <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Scrollable Container */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] sm:auto-cols-[minmax(300px,1fr)] gap-6">
                    {featuredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Auctions Section - MOVED TO BOTTOM */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">
                  {t("featuredAuctions")}
                </h2>
              </div>
              <Link href="/browse?listingType=Auction">
                <Button variant="outline">
                  {t("showMore")}
                </Button>
              </Link>
            </div>

            {loadingAuctions ? (
              <div className="text-center py-12 text-muted-foreground">
                {t("loading")}
              </div>
            ) : endingSoonAuctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("noActiveAuctions")}</p>
                <Link href="/browse">
                  <Button variant="outline">{t("browseAllListings")}</Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Scroll Left Button */}
                {endingSoonAuctions.length > 4 && canScrollLeftAuctions && (
                  <button
                    onClick={() => scrollAuctions('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Scroll Right Button */}
                {endingSoonAuctions.length > 4 && canScrollRightAuctions && (
                  <button
                    onClick={() => scrollAuctions('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Scrollable Container */}
                <div
                  ref={auctionScrollContainerRef}
                  className="overflow-x-auto scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] sm:auto-cols-[minmax(300px,1fr)] gap-6">
                    {endingSoonAuctions.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>
    </div>
  )
}
