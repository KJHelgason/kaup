"use client"

import { Header } from "@/components/Header"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getListings, Listing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState, useCallback } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

export default function BrowsePage() {
  const { t } = useLanguage()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    "Rafeindatækni", // Electronics
    "Tíska", // Fashion
    "Heimili", // Home
    "Íþróttir", // Sports
    "Farartæki", // Vehicles
    "Bækur", // Books
    "Leikföng", // Toys
    "Garður", // Garden
    "Annað" // Other
  ]

  const loadListings = useCallback(async () => {
    setLoading(true)
    const result = await getListings({
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: currentPage,
      pageSize
    })
    setListings(result.listings)
    setTotalCount(result.totalCount)
    setLoading(false)
  }, [currentPage, searchQuery, selectedCategory, minPrice, maxPrice])

  useEffect(() => {
    loadListings()
  }, [loadListings])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setCurrentPage(1)
    loadListings()
  }

  function clearFilters() {
    setSearchQuery("")
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCount / pageSize)
  const hasActiveFilters = searchQuery || selectedCategory || minPrice || maxPrice

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{t("browse")}</h1>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {t("filters")}
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside className={`
              ${showFilters ? 'block' : 'hidden'} lg:block
              w-full lg:w-64 bg-background rounded-lg border p-6 h-fit
            `}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t("filters")}</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    {t("clear")}
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <Label htmlFor="search" className="mb-2 block">
                  {t("search")}
                </Label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="mb-2 block">{t("category")}</Label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("")
                      setCurrentPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {t("allCategories")}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {t(category)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="mb-2 block">{t("priceRange")}</Label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder={t("minPrice")}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                    step="100"
                  />
                  <Input
                    type="number"
                    placeholder={t("maxPrice")}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  setCurrentPage(1)
                  loadListings()
                }}
                className="w-full"
              >
                {t("applyFilters")}
              </Button>
            </aside>

            {/* Listings Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    t("loading")
                  ) : (
                    <>
                      {totalCount} {totalCount === 1 ? t("result") : t("results")}
                    </>
                  )}
                </p>
              </div>

              {/* Listings Grid */}
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t("loading")}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">{t("noResults")}</p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      {t("clearFilters")}
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        {t("previous")}
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        {t("next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
