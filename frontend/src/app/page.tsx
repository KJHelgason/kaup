"use client"

import { Header } from "@/components/Header"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { getFeaturedListings, Listing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const { t } = useLanguage()
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      const listings = await getFeaturedListings(6)
      setFeaturedListings(listings)
      setLoading(false)
    }
    loadListings()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
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

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {t("featuredListings")}
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                {t("loading")}
              </div>
            ) : featuredListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("noResults")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>
    </div>
  )
}
