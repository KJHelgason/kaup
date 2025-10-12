"use client"

import { Header } from "@/components/Header"
import { categories } from "@/lib/categories"
import { getListings, Listing } from "@/lib/api"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ListingCard } from "@/components/ListingCard"
import { ChevronRight, Grid3x3, List, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ListingTypeFilter = "all" | "auction" | "buyNow" | "bestOffer"
type SortOption = "bestMatch" | "endingSoonest" | "newlyListed" | "priceLowest" | "priceHighest"
type ViewMode = "gallery" | "list"
type ConditionFilter = "all" | "New" | "Used" | "For Parts"

export default function BrowsePage() {
    const searchParams = useSearchParams()
    const [listings, setListings] = useState<Listing[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    // Filter states
    const [listingTypeFilter, setListingTypeFilter] = useState<ListingTypeFilter>("all")
    const [sortOption, setSortOption] = useState<SortOption>("bestMatch")
    const [viewMode, setViewMode] = useState<ViewMode>("gallery")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("all")
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)

    // Get search query from URL
    const searchQuery = searchParams.get('search') || ''
    const categoryParam = searchParams.get('category')

    // Calculate filter counts from current listings
    const getConditionCounts = () => {
        if (!listings.length) return { New: 0, Used: 0, 'For Parts': 0 }
        return {
            New: listings.filter(l => l.condition === 'New').length,
            Used: listings.filter(l => l.condition === 'Used').length,
            'For Parts': listings.filter(l => l.condition === 'For Parts').length,
        }
    }

    const conditionCounts = getConditionCounts()

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam)
        }
    }, [categoryParam])

    useEffect(() => {
        async function loadListings() {
            setLoading(true)

            // Build API params based on filters
            const apiParams: any = {
                page: currentPage,
                pageSize: 48
            }

            // Apply search query
            if (searchQuery) {
                apiParams.search = searchQuery
            }

            // Apply category filter
            if (selectedCategory) {
                apiParams.category = selectedCategory
            }

            // Apply listing type filter
            if (listingTypeFilter === "auction") {
                apiParams.listingType = "auction"
            } else if (listingTypeFilter === "buyNow") {
                apiParams.listingType = "buyNow"
            } else if (listingTypeFilter === "bestOffer") {
                apiParams.acceptOffers = true
            }

            // Apply condition filter
            if (conditionFilter !== "all") {
                apiParams.condition = conditionFilter
            }

            // Apply price filters
            if (minPrice) {
                apiParams.minPrice = parseFloat(minPrice)
            }
            if (maxPrice) {
                apiParams.maxPrice = parseFloat(maxPrice)
            }

            const result = await getListings(apiParams)

            // Apply client-side sorting
            let sortedListings = [...result.listings]
            switch (sortOption) {
                case "endingSoonest":
                    sortedListings.sort((a, b) => {
                        if (!a.endDate) return 1
                        if (!b.endDate) return -1
                        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
                    })
                    break
                case "newlyListed":
                    sortedListings.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    })
                    break
                case "priceLowest":
                    sortedListings.sort((a, b) => a.price - b.price)
                    break
                case "priceHighest":
                    sortedListings.sort((a, b) => b.price - a.price)
                    break
            }

            setListings(sortedListings)
            setTotalCount(result.totalCount || sortedListings.length)
            setLoading(false)
        }

        loadListings()
    }, [searchQuery, selectedCategory, currentPage, listingTypeFilter, conditionFilter, minPrice, maxPrice, sortOption])

    const pageCount = Math.ceil(totalCount / 48)

    // Helper to check if any filters are active
    const hasActiveFilters = selectedCategory !== null || conditionFilter !== "all" || minPrice !== "" || maxPrice !== "" || listingTypeFilter !== "all"

    // Helper to clear all filters
    const clearAllFilters = () => {
        setSelectedCategory(null)
        setConditionFilter("all")
        setMinPrice("")
        setMaxPrice("")
        setListingTypeFilter("all")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-[1400px] mx-auto px-6 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">
                        {searchQuery ? `Search: "${searchQuery}"` : 'All Listings'}
                    </span>
                </div>

                {/* Results Count - Prominent */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                        {totalCount.toLocaleString()} {totalCount === 1 ? "result" : "results"} 
                        {searchQuery && ` for "${searchQuery}"`}
                    </h1>
                    
                    {/* Active Filter Chips */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="text-sm text-muted-foreground">Filters:</span>
                            
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                >
                                    {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
                                    <X className="h-3 w-3" />
                                </button>
                            )}

                            {conditionFilter !== "all" && (
                                <button
                                    onClick={() => setConditionFilter("all")}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                >
                                    Condition: {conditionFilter}
                                    <X className="h-3 w-3" />
                                </button>
                            )}

                            {listingTypeFilter !== "all" && (
                                <button
                                    onClick={() => setListingTypeFilter("all")}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                >
                                    {listingTypeFilter === "auction" && "Auction"}
                                    {listingTypeFilter === "buyNow" && "Buy It Now"}
                                    {listingTypeFilter === "bestOffer" && "Best Offer"}
                                    <X className="h-3 w-3" />
                                </button>
                            )}

                            {(minPrice || maxPrice) && (
                                <button
                                    onClick={() => { setMinPrice(""); setMaxPrice("") }}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                >
                                    Price: {minPrice && `$${minPrice}`}{minPrice && maxPrice && " - "}{maxPrice && `$${maxPrice}`}
                                    <X className="h-3 w-3" />
                                </button>
                            )}

                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-primary hover:underline ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-[280px] flex-shrink-0">
                        <div className="bg-white rounded-lg p-4 shadow-sm sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg">Filters</h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-3 text-sm">Category</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${selectedCategory === null
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>All Categories</span>
                                        <span className="text-xs text-muted-foreground">{totalCount}</span>
                                    </button>
                                    {categories.map((cat) => {
                                        const catCount = listings.filter(l => l.category === cat.value).length
                                        return (
                                            <button
                                                key={cat.value}
                                                onClick={() => setSelectedCategory(cat.value)}
                                                className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${selectedCategory === cat.value
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "hover:bg-muted"
                                                    }`}
                                            >
                                                <span>{cat.label}</span>
                                                {catCount > 0 && (
                                                    <span className="text-xs text-muted-foreground">({catCount})</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-3 text-sm">Condition</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setConditionFilter("all")}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${conditionFilter === "all"
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>All Conditions</span>
                                    </button>
                                    <button
                                        onClick={() => setConditionFilter("New")}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${conditionFilter === "New"
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>New</span>
                                        {conditionCounts.New > 0 && (
                                            <span className="text-xs text-muted-foreground">({conditionCounts.New})</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setConditionFilter("Used")}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${conditionFilter === "Used"
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>Used</span>
                                        {conditionCounts.Used > 0 && (
                                            <span className="text-xs text-muted-foreground">({conditionCounts.Used})</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setConditionFilter("For Parts")}
                                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${conditionFilter === "For Parts"
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted"
                                            }`}
                                    >
                                        <span>For Parts</span>
                                        {conditionCounts['For Parts'] > 0 && (
                                            <span className="text-xs text-muted-foreground">({conditionCounts['For Parts']})</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
                                <div className="space-y-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full"
                                    />
                                    {(minPrice || maxPrice) && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setMinPrice("")
                                                setMaxPrice("")
                                            }}
                                            className="w-full"
                                        >
                                            Clear Price
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Top Controls Bar */}
                        <div className="p-4 pb-0">
                            {/* First Row: Listing Type Slider & Sort/View Controls */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                {/* Listing Type Slider */}
                                <div className="bg-background border-1 rounded-full flex items-center gap-2 overflow-x-auto p-0.5">
                                    <button
                                        onClick={() => setListingTypeFilter("all")}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${listingTypeFilter === "all"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted/80"
                                            }`}
                                    >
                                        All Listings
                                    </button>
                                    <button
                                        onClick={() => setListingTypeFilter("auction")}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${listingTypeFilter === "auction"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted/80"
                                            }`}
                                    >
                                        Auction
                                    </button>
                                    <button
                                        onClick={() => setListingTypeFilter("buyNow")}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${listingTypeFilter === "buyNow"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted/80"
                                            }`}
                                    >
                                        Buy It Now
                                    </button>
                                    <button
                                        onClick={() => setListingTypeFilter("bestOffer")}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${listingTypeFilter === "bestOffer"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted/80"
                                            }`}
                                    >
                                        Best Offer
                                    </button>
                                </div>

                                {/* Sort & View Controls */}
                                <div className="flex items-center gap-4">
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                                            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm bg-background hover:bg-muted transition-colors"
                                        >
                                            <span className="font-medium">Sort:</span>
                                            <span>
                                                {sortOption === "bestMatch" && "Best Match"}
                                                {sortOption === "endingSoonest" && "Time: ending soonest"}
                                                {sortOption === "newlyListed" && "Time: newly listed"}
                                                {sortOption === "priceLowest" && "Price: lowest"}
                                                {sortOption === "priceHighest" && "Price: highest"}
                                            </span>
                                            <ChevronDown className="h-4 w-4" />
                                        </button>

                                        {showSortDropdown && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setShowSortDropdown(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-20">
                                                    <button
                                                        onClick={() => {
                                                            setSortOption("bestMatch")
                                                            setShowSortDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === "bestMatch" ? "bg-primary/10 text-primary font-medium" : ""
                                                            }`}
                                                    >
                                                        Best Match
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortOption("endingSoonest")
                                                            setShowSortDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === "endingSoonest" ? "bg-primary/10 text-primary font-medium" : ""
                                                            }`}
                                                    >
                                                        Time: ending soonest
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortOption("newlyListed")
                                                            setShowSortDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === "newlyListed" ? "bg-primary/10 text-primary font-medium" : ""
                                                            }`}
                                                    >
                                                        Time: newly listed
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortOption("priceLowest")
                                                            setShowSortDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === "priceLowest" ? "bg-primary/10 text-primary font-medium" : ""
                                                            }`}
                                                    >
                                                        Price: lowest
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSortOption("priceHighest")
                                                            setShowSortDropdown(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === "priceHighest" ? "bg-primary/10 text-primary font-medium" : ""
                                                            }`}
                                                    >
                                                        Price: highest
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* View Mode Toggle */}
                                    <div className="flex items-center gap-1 border rounded-md p-1">
                                        <button
                                            onClick={() => setViewMode("gallery")}
                                            className={`p-2 rounded transition-colors ${viewMode === "gallery"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                }`}
                                            title="Gallery View"
                                        >
                                            <Grid3x3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded transition-colors ${viewMode === "list"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                }`}
                                            title="List View"
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Divider */}
                            <div className="border-t my-4"></div>
                        </div>

                        {/* Listings Section */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading listings...</p>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg">
                                <p className="text-muted-foreground mb-2">No listings found matching your criteria.</p>
                                {hasActiveFilters && (
                                    <Button
                                        onClick={clearAllFilters}
                                        className="mt-4"
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Listings Grid */}
                                <div
                                    className={
                                        viewMode === "gallery"
                                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                                            : "flex flex-col gap-4"
                                    }
                                >
                                    {listings.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pageCount > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm text-gray-600">
                                            Page {currentPage} of {pageCount}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                                            disabled={currentPage === pageCount}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-colors z-10"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                </button>

                {/* Mobile Filters Modal */}
                {showMobileFilters && (
                    <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Category Filter */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Category</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(null)
                                                setShowMobileFilters(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${selectedCategory === null
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            All Categories
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.value}
                                                onClick={() => {
                                                    setSelectedCategory(cat.value)
                                                    setShowMobileFilters(false)
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded text-sm ${selectedCategory === cat.value
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "hover:bg-muted"
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition Filter */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Condition</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setConditionFilter("all")
                                                setShowMobileFilters(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${conditionFilter === "all"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            All Conditions
                                        </button>
                                        <button
                                            onClick={() => {
                                                setConditionFilter("New")
                                                setShowMobileFilters(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${conditionFilter === "New"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            New
                                        </button>
                                        <button
                                            onClick={() => {
                                                setConditionFilter("Used")
                                                setShowMobileFilters(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${conditionFilter === "Used"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            Used
                                        </button>
                                        <button
                                            onClick={() => {
                                                setConditionFilter("For Parts")
                                                setShowMobileFilters(false)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded text-sm ${conditionFilter === "For Parts"
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            For Parts
                                        </button>
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Price Range</h3>
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full"
                                        />
                                        {(minPrice || maxPrice) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setMinPrice("")
                                                    setMaxPrice("")
                                                }}
                                                className="w-full"
                                            >
                                                Clear Price
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200">
                                <Button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
