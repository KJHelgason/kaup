"use client"

import { Header } from "@/components/Header"
import { categories } from "@/lib/categories"
import { getListings, Listing } from "@/lib/api"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ListingCard } from "@/components/ListingCard"
import { ChevronRight, Grid3x3, List, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFiltersForCategory, CategoryFilter, FilterOption } from "@/lib/categoryFilters"
import { useLanguage } from "@/contexts/LanguageContext"

type ListingTypeFilter = "all" | "auction" | "buyNow" | "bestOffer"
type SortOption = "bestMatch" | "endingSoonest" | "newlyListed" | "priceLowest" | "priceHighest"
type ViewMode = "gallery" | "list"
type ConditionFilter = "all" | "Brand New" | "New" | "Like New" | "Good" | "Fair" | "Poor"

export default function BrowsePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useLanguage()
    const [listings, setListings] = useState<Listing[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    // Filter states
    const [listingTypeFilter, setListingTypeFilter] = useState<ListingTypeFilter>("all")
    const [sortOption, setSortOption] = useState<SortOption>("bestMatch")
    const [viewMode, setViewMode] = useState<ViewMode>("gallery")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [conditionFilter, setConditionFilter] = useState<string[]>([]) // Changed to array for multi-select
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [minPriceInput, setMinPriceInput] = useState<string>("")
    const [maxPriceInput, setMaxPriceInput] = useState<string>("")
    const [minSliderValue, setMinSliderValue] = useState<number>(0)
    const [maxSliderValue, setMaxSliderValue] = useState<number>(0)
    const [priceError, setPriceError] = useState<string>("")
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)

    // Get search query from URL
    const searchQuery = searchParams.get('search') || ''
    const categoryParam = searchParams.get('category')

    // Calculate filter counts from current listings
    const getConditionCounts = () => {
        if (!listings.length) return {
            'Brand New': 0,
            'New': 0,
            'Like New': 0,
            'Good': 0,
            'Fair': 0,
            'Poor': 0
        }
        return {
            'Brand New': listings.filter(l => l.condition === 'Brand New').length,
            'New': listings.filter(l => l.condition === 'New').length,
            'Like New': listings.filter(l => l.condition === 'Like New').length,
            'Good': listings.filter(l => l.condition === 'Good').length,
            'Fair': listings.filter(l => l.condition === 'Fair').length,
            'Poor': listings.filter(l => l.condition === 'Poor').length,
        }
    }

    const conditionCounts = getConditionCounts()

    // Detect primary category from search results
    const detectPrimaryCategory = () => {
        if (!listings.length) return null

        // Count listings per category
        const categoryCounts: Record<string, number> = {}
        listings.forEach(listing => {
            if (listing.category) {
                categoryCounts[listing.category] = (categoryCounts[listing.category] || 0) + 1
            }
        })

        // Find category with most listings
        let maxCount = 0
        let primaryCat = null
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            if (count > maxCount) {
                maxCount = count
                primaryCat = cat
            }
        })

        return primaryCat
    }

    const primaryCategory = detectPrimaryCategory()
    const primaryCategoryData = categories.find(c => c.value === primaryCategory)

    // Get subcategory counts
    const getSubcategoryCounts = () => {
        if (!primaryCategoryData) return {}
        const counts: Record<string, number> = {}

        listings.forEach(listing => {
            if (listing.subcategory && listing.category === primaryCategory) {
                counts[listing.subcategory] = (counts[listing.subcategory] || 0) + 1
            }
        })

        return counts
    }

    const subcategoryCounts = getSubcategoryCounts()

    // Get sub-subcategory counts
    const getSubSubcategoryCounts = () => {
        if (!primaryCategoryData) return {}
        const counts: Record<string, number> = {}

        listings.forEach(listing => {
            if (listing.subSubcategory && listing.category === primaryCategory) {
                counts[listing.subSubcategory] = (counts[listing.subSubcategory] || 0) + 1
            }
        })

        return counts
    }

    const subSubcategoryCounts = getSubSubcategoryCounts()

    // Detect the most common subcategory from actual listings
    const detectPrimarySubcategory = () => {
        if (!listings.length) return null

        const subcatCounts: Record<string, number> = {}
        listings.forEach(listing => {
            if (listing.subcategory) {
                subcatCounts[listing.subcategory] = (subcatCounts[listing.subcategory] || 0) + 1
            }
        })

        if (Object.keys(subcatCounts).length === 0) return null

        // Return the subcategory with the highest count
        return Object.entries(subcatCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }

    // Detect the most common sub-subcategory from actual listings
    const detectPrimarySubSubcategory = () => {
        if (!listings.length) return null

        const subSubcatCounts: Record<string, number> = {}
        listings.forEach(listing => {
            if (listing.subSubcategory) {
                subSubcatCounts[listing.subSubcategory] = (subSubcatCounts[listing.subSubcategory] || 0) + 1
            }
        })

        if (Object.keys(subSubcatCounts).length === 0) return null

        // Return the sub-subcategory with the highest count
        return Object.entries(subSubcatCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    }

    const primarySubcategory = detectPrimarySubcategory()
    const primarySubSubcategory = detectPrimarySubSubcategory()

    // Get predefined filters for the current category/subcategory
    const availableFilters = getFiltersForCategory(
        primaryCategory,  // category comes first
        primarySubcategory,  // then the most common subcategory from listings
        primarySubSubcategory  // then the most common sub-subcategory from listings
    )

    // Calculate counts for each filter option from current listings
    const getFilterOptionCounts = (fieldName: string) => {
        const counts: Record<string, number> = {}
        listings.forEach(listing => {
            const value = listing.categorySpecificFields?.[fieldName]
            if (value) {
                counts[String(value)] = (counts[String(value)] || 0) + 1
            }
        })
        return counts
    }

    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({})

    // Track which filters are collapsed (eBay-style +/- toggles)
    const [collapsedFilters, setCollapsedFilters] = useState<Record<string, boolean>>({})

    // Track which filters are showing all items (expanded beyond 8)
    const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({})

    // Redirect to /categories if no search query
    useEffect(() => {
        if (!searchQuery && !categoryParam) {
            router.push('/categories')
        }
    }, [searchQuery, categoryParam, router])

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
            if (conditionFilter.length > 0) {
                // For multi-select, we'd need to update the backend API to support multiple conditions
                // For now, we'll just pass the first one (this is a simplification)
                apiParams.condition = conditionFilter[0]
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
    const hasActiveFilters = selectedCategory !== null || conditionFilter.length > 0 || minPrice !== "" || maxPrice !== "" || listingTypeFilter !== "all" || Object.keys(selectedAttributes).length > 0

    // Helper to clear all filters
    const clearAllFilters = () => {
        setSelectedCategory(null)
        setConditionFilter([])
        setMinPrice("")
        setMaxPrice("")
        setListingTypeFilter("all")
        setSelectedAttributes({})
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-[1400px] mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-[280px] flex-shrink-0">
                        <div className="p-4 sticky top-4">

                            {/* Category Filter - eBay Style Dynamic */}
                            <div className="mb-6 pb-6 border-b">
                                <h3 className="font-semibold mb-3 text-sm">Category</h3>

                                {/* Show current category and subcategory as clickable links */}
                                {primaryCategoryData ? (
                                    <div className="text-sm">
                                        {/* Primary Category Link */}
                                        <Link
                                            href={`/browse?category=${primaryCategory}`}
                                            className="text-primary hover:underline block pl-4"
                                        >
                                            {t(primaryCategoryData.value)}
                                        </Link>

                                        {/* Subcategory Links */}
                                        {primaryCategoryData.subcategories.map((subcat) => {
                                            const count = subcategoryCounts[subcat.value] || 0
                                            if (count === 0) return null

                                            return (
                                                <div key={subcat.value}>
                                                    <Link
                                                        href={`/browse?category=${primaryCategory}&subcategory=${subcat.value}`}
                                                        className="text-primary hover:underline block pl-8"
                                                    >
                                                        {t(subcat.value)}
                                                    </Link>

                                                    {/* Sub-subcategory Links */}
                                                    {subcat.subSubcategories.map((subSubcat) => {
                                                        const subSubCount = subSubcategoryCounts[subSubcat] || 0
                                                        if (subSubCount === 0) return null

                                                        return (
                                                            <Link
                                                                key={subSubcat}
                                                                href={`/browse?category=${primaryCategory}&subcategory=${subcat.value}&subSubcategory=${subSubcat}`}
                                                                className="text-primary hover:underline block pl-12"
                                                            >
                                                                {t(subSubcat)}
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    /* Show all categories when no detected category */
                                    <div className="space-y-1 text-sm">
                                        <div className="text-muted-foreground mb-2">{t('All Categories')}</div>
                                        {categories.map((cat) => {
                                            const catCount = listings.filter(l => l.category === cat.value).length
                                            if (catCount === 0 && listings.length > 0) return null

                                            return (
                                                <Link
                                                    key={cat.value}
                                                    href={`/browse?category=${cat.value}`}
                                                    className="text-primary hover:underline block"
                                                >
                                                    {t(cat.value)}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-6 pb-6 border-b">
                                <button
                                    onClick={() => setCollapsedFilters(prev => ({ ...prev, condition: !prev.condition }))}
                                    className="w-full flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-sm">Condition</h3>
                                    <span className="text-lg font-light text-muted-foreground">
                                        {collapsedFilters.condition ? "+" : "−"}
                                    </span>
                                </button>
                                {!collapsedFilters.condition && (
                                    <div className="space-y-0">
                                        {['Brand New', 'New', 'Like New', 'Good', 'Fair', 'Poor'].map((condition) => {
                                            const count = conditionCounts[condition as keyof typeof conditionCounts] || 0
                                            const isChecked = conditionFilter.includes(condition)

                                            return (
                                                <label
                                                    key={condition}
                                                    className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            setConditionFilter(prev =>
                                                                prev.includes(condition)
                                                                    ? prev.filter(c => c !== condition)
                                                                    : [...prev, condition]
                                                            )
                                                        }}
                                                        className="mr-2 h-4 w-4 rounded border-input"
                                                    />
                                                    <span className="flex-1">
                                                        {condition} <span className="text-xs text-muted-foreground font-mono">({count.toLocaleString()})</span>
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6 pb-6 border-b">
                                <button
                                    onClick={() => setCollapsedFilters(prev => ({ ...prev, price: !prev.price }))}
                                    className="w-full flex items-center justify-between"
                                >
                                    <h3 className="font-semibold text-sm">Price</h3>
                                    <span className="text-lg font-light text-muted-foreground">
                                        {collapsedFilters.price ? "+" : "−"}
                                    </span>
                                </button>
                                {!collapsedFilters.price && (
                                    <div className="space-y-2">
                                        {/* Quick price range checkboxes - calculated from listings */}
                                        {(() => {
                                            const prices = listings.map(l => l.price || 0).filter(p => p > 0)
                                            if (prices.length === 0) return null

                                            prices.sort((a, b) => a - b)
                                            const maxListingPrice = prices[prices.length - 1]
                                            const midPoint1 = maxListingPrice * 0.3
                                            const midPoint2 = maxListingPrice * 0.5

                                            const range1Count = prices.filter(p => p < midPoint1).length
                                            const range2Count = prices.filter(p => p >= midPoint1 && p <= midPoint2).length
                                            const range3Count = prices.filter(p => p > midPoint2).length

                                            // Calculate string values for checkbox comparisons
                                            const maxVal1 = Math.floor(midPoint1).toString()
                                            const minVal2 = Math.floor(midPoint1).toString()
                                            const maxVal2 = Math.floor(midPoint2).toString()
                                            const minVal3 = Math.floor(midPoint2).toString()

                                            return (
                                                <div className="space-y-0 mb-3">
                                                    <label className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={minPrice === "" && maxPrice === maxVal1}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setMinPrice("")
                                                                    setMaxPrice(maxVal1)
                                                                    setMinPriceInput("")
                                                                    setMaxPriceInput(maxVal1)
                                                                } else {
                                                                    setMinPrice("")
                                                                    setMaxPrice("")
                                                                    setMinPriceInput("")
                                                                    setMaxPriceInput("")
                                                                }
                                                            }}
                                                            className="mr-2 h-4 w-4 rounded border-input"
                                                        />
                                                        <span className="flex-1">
                                                            Under {Math.floor(midPoint1).toLocaleString()} kr <span className="text-xs text-muted-foreground font-mono">({range1Count})</span>
                                                        </span>
                                                    </label>
                                                    <label className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={minPrice === minVal2 && maxPrice === maxVal2}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setMinPrice(minVal2)
                                                                    setMaxPrice(maxVal2)
                                                                    setMinPriceInput(minVal2)
                                                                    setMaxPriceInput(maxVal2)
                                                                } else {
                                                                    setMinPrice("")
                                                                    setMaxPrice("")
                                                                    setMinPriceInput("")
                                                                    setMaxPriceInput("")
                                                                }
                                                            }}
                                                            className="mr-2 h-4 w-4 rounded border-input"
                                                        />
                                                        <span className="flex-1">
                                                            {Math.floor(midPoint1).toLocaleString()} kr to {Math.floor(midPoint2).toLocaleString()} kr <span className="text-xs text-muted-foreground font-mono">({range2Count})</span>
                                                        </span>
                                                    </label>
                                                    <label className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={minPrice === minVal3 && maxPrice === ""}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setMinPrice(minVal3)
                                                                    setMaxPrice("")
                                                                    setMinPriceInput(minVal3)
                                                                    setMaxPriceInput("")
                                                                } else {
                                                                    setMinPrice("")
                                                                    setMaxPrice("")
                                                                    setMinPriceInput("")
                                                                    setMaxPriceInput("")
                                                                }
                                                            }}
                                                            className="mr-2 h-4 w-4 rounded border-input"
                                                        />
                                                        <span className="flex-1">
                                                            Over {Math.floor(midPoint2).toLocaleString()} kr <span className="text-xs text-muted-foreground font-mono">({range3Count})</span>
                                                        </span>
                                                    </label>
                                                </div>
                                            )
                                        })()}

                                        {/* Min/Max inputs with submit button on one line */}
                                        <div className="px-3">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={minPriceInput}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        setMinPriceInput(value)
                                                        setMinSliderValue(value ? parseFloat(value) : 0)
                                                        setPriceError("") // Clear error on input change
                                                    }}
                                                    className="w-24 h-8 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <span className="text-sm">to</span>
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={maxPriceInput}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        setMaxPriceInput(value)
                                                        setMaxSliderValue(value ? parseFloat(value) : 0)
                                                        setPriceError("") // Clear error on input change
                                                    }}
                                                    className="w-24 h-8 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        // Validate inputs
                                                        const min = minPriceInput ? parseFloat(minPriceInput) : null
                                                        const max = maxPriceInput ? parseFloat(maxPriceInput) : null

                                                        // Check for invalid conditions
                                                        if (min !== null && min < 0) {
                                                            setPriceError("Minimum price cannot be negative")
                                                            return
                                                        }
                                                        if (max !== null && max < 0) {
                                                            setPriceError("Maximum price cannot be negative")
                                                            return
                                                        }
                                                        if (min !== null && max !== null && min > max) {
                                                            setPriceError("Invalid range: minimum cannot exceed maximum")
                                                            return
                                                        }

                                                        // Clear error and apply the filter
                                                        setPriceError("")
                                                        setMinPrice(minPriceInput)
                                                        setMaxPrice(maxPriceInput)
                                                        setCurrentPage(1)
                                                    }}
                                                    className="w-8 h-8 min-w-[32px] rounded-full border border-border flex items-center justify-center hover:bg-muted flex-shrink-0"
                                                    title="Apply price filter"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {priceError && (
                                                <div className="text-xs text-red-600 mt-1">
                                                    {priceError}
                                                </div>
                                            )}
                                        </div>

                                        {/* Available inventory text and histogram */}
                                        {listings.length > 0 && (() => {
                                            const prices = listings.map(l => l.price || 0).filter(p => p > 0)
                                            if (prices.length === 0) return null

                                            const maxListingPrice = Math.max(...prices)
                                            const barCount = 15
                                            const barWidth = maxListingPrice / barCount

                                            // Calculate step size - round to nearest 10 for cleaner increments
                                            const stepSize = Math.max(1, Math.round(barWidth / 10) * 10)

                                            // Count items in each price bar
                                            const barCounts = Array(barCount).fill(0)
                                            prices.forEach(price => {
                                                const barIndex = Math.min(Math.floor(price / barWidth), barCount - 1)
                                                barCounts[barIndex]++
                                            })

                                            const maxBarCount = Math.max(...barCounts, 1)

                                            return (
                                                <div className="px-3 mt-4">
                                                    <div className="text-xs text-muted-foreground mb-2">Available inventory</div>
                                                    <div className="flex items-end gap-0.5 h-24 mb-1">
                                                        {barCounts.map((count, index) => {
                                                            const heightPercent = (count / maxBarCount) * 100
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="flex-1 bg-muted rounded-t"
                                                                    style={{
                                                                        height: count > 0 ? `${Math.max(heightPercent, 8)}%` : '2px',
                                                                        minHeight: '2px'
                                                                    }}
                                                                    title={`${Math.floor(index * barWidth)} kr - ${Math.floor((index + 1) * barWidth)} kr: ${count} items`}
                                                                />
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Price Range Slider - positioned right below histogram */}
                                                    <div className="relative mt-1" style={{ height: '24px' }}>
                                                        {/* Track line */}
                                                        <div className="absolute w-full h-px bg-border" style={{ top: '8px' }}></div>

                                                        {/* Highlighted range */}
                                                        <div
                                                            className="absolute h-px bg-primary pointer-events-none"
                                                            style={{
                                                                top: '8px',
                                                                left: `${((minSliderValue || 0) / maxListingPrice) * 100}%`,
                                                                right: `${100 - ((maxSliderValue || maxListingPrice) / maxListingPrice) * 100}%`
                                                            }}
                                                        ></div>

                                                        {/* Min slider */}
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max={maxListingPrice}
                                                            step="1"
                                                            value={minSliderValue || 0}
                                                            onChange={(e) => {
                                                                const rawValue = parseFloat(e.target.value)
                                                                const currentMaxSlider = maxSliderValue || maxListingPrice
                                                                const maxAllowedMin = stepSize * 14 // Stop at 14th increment

                                                                // Constrain min slider to not exceed 14th increment or max slider position
                                                                const constrainedValue = Math.min(rawValue, maxAllowedMin, currentMaxSlider)

                                                                setMinSliderValue(constrainedValue)

                                                                // Round to nearest step for display only
                                                                const roundedValue = Math.round(constrainedValue / stepSize) * stepSize
                                                                setMinPriceInput(roundedValue === 0 ? "" : roundedValue.toString())
                                                                setPriceError("")
                                                            }}
                                                            className="absolute w-full appearance-none bg-transparent slider-thumb-primary"
                                                            style={{
                                                                top: '-7px',
                                                                zIndex: 2
                                                            }}
                                                        />

                                                        {/* Max slider */}
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max={maxListingPrice}
                                                            step="1"
                                                            value={maxSliderValue || maxListingPrice}
                                                            onChange={(e) => {
                                                                const rawValue = parseFloat(e.target.value)
                                                                const currentMinSlider = minSliderValue || 0
                                                                const minAllowedMax = stepSize * 1 // Stop at 2nd increment

                                                                // Constrain max slider to not go below 2nd increment or min slider position
                                                                const constrainedValue = Math.max(rawValue, minAllowedMax, currentMinSlider)

                                                                setMaxSliderValue(constrainedValue)

                                                                // Round to nearest step for display only
                                                                const roundedValue = Math.round(constrainedValue / stepSize) * stepSize
                                                                // If at max (within a step), clear the input to show "+"
                                                                const isAtMax = constrainedValue >= maxListingPrice - stepSize
                                                                setMaxPriceInput(isAtMax ? "" : roundedValue.toString())
                                                                setPriceError("")
                                                            }}
                                                            className="absolute w-full appearance-none bg-transparent slider-thumb-primary"
                                                            style={{
                                                                top: '-7px',
                                                                zIndex: 3
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Dynamic labels and min/max values */}
                                                    <div className="flex justify-between items-start mt-1">
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {minPriceInput ? `${parseFloat(minPriceInput).toLocaleString()} kr` : '0 kr'}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground font-mono">
                                                            {maxPriceInput ? `${parseFloat(maxPriceInput).toLocaleString()} kr` : `${Math.floor(maxListingPrice).toLocaleString()} kr+`}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Attribute Filters - eBay Style with Predefined Options */}
                            {availableFilters.length > 0 && availableFilters.map((filter: CategoryFilter) => {
                                const optionCounts = getFilterOptionCounts(filter.fieldName)
                                const isCollapsed = collapsedFilters[filter.name]
                                const isExpanded = expandedFilters[filter.name]
                                const displayLimit = isExpanded ? filter.options?.length : 8
                                const hasMoreItems = filter.options && filter.options.length > 8

                                return (
                                    <div key={filter.name} className="mb-6 pb-6 border-b">
                                        <button
                                            onClick={() => setCollapsedFilters(prev => ({ ...prev, [filter.name]: !prev[filter.name] }))}
                                            className="w-full flex items-center justify-between"
                                        >
                                            <h3 className="font-semibold text-sm">{t(filter.name)}</h3>
                                            <span className="text-lg font-light text-muted-foreground">
                                                {isCollapsed ? "+" : "−"}
                                            </span>
                                        </button>
                                        {!isCollapsed && (
                                            <>
                                                <div className="space-y-0">
                                                    {filter.options?.slice(0, displayLimit).map((option: FilterOption) => {
                                                        const count = optionCounts[option.value] || 0
                                                        const isChecked = selectedAttributes[filter.name]?.includes(option.value)

                                                        return (
                                                            <label
                                                                key={option.value}
                                                                className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => {
                                                                        setSelectedAttributes(prev => {
                                                                            const current = prev[filter.name] || []
                                                                            const newAttrs = { ...prev }

                                                                            if (current.includes(option.value)) {
                                                                                newAttrs[filter.name] = current.filter(v => v !== option.value)
                                                                                if (newAttrs[filter.name].length === 0) {
                                                                                    delete newAttrs[filter.name]
                                                                                }
                                                                            } else {
                                                                                newAttrs[filter.name] = [...current, option.value]
                                                                            }

                                                                            return newAttrs
                                                                        })
                                                                    }}
                                                                    className="mr-2 h-4 w-4 rounded border-input"
                                                                />
                                                                <span className="flex-1 truncate">
                                                                    {option.label} <span className="text-xs text-muted-foreground font-mono">({count.toLocaleString()})</span>
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                                {hasMoreItems && !isExpanded && (
                                                    <button
                                                        className="w-full text-left px-3 py-2 text-sm text-primary hover:underline mt-1"
                                                        onClick={() => {
                                                            setExpandedFilters(prev => ({ ...prev, [filter.name]: true }))
                                                        }}
                                                    >
                                                        See all
                                                    </button>
                                                )}
                                                {hasMoreItems && isExpanded && (
                                                    <button
                                                        className="w-full text-left px-3 py-2 text-sm text-primary hover:underline mt-1"
                                                        onClick={() => {
                                                            setExpandedFilters(prev => ({ ...prev, [filter.name]: false }))
                                                        }}
                                                    >
                                                        See less
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Results Count - Prominent */}
                        <h1 className="text-md">
                            <span className="font-bold">
                                {totalCount.toLocaleString()}{" "}
                            </span>
                            <span>
                                {totalCount === 1 ? "result" : "results"}{" for"}
                            </span>
                            <span className="font-bold">
                                {searchQuery && ` ${searchQuery}`}
                            </span>
                        </h1>


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

                            {/* Active Filter Chips */}
                            {hasActiveFilters && (
                                <>
                                    <div className="flex flex-wrap items-center gap-2 px-4">
                                        {selectedCategory && (
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                            >
                                                {categories.find(c => c.value === selectedCategory)?.label || selectedCategory}
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}

                                        {conditionFilter.map((condition) => (
                                            <button
                                                key={condition}
                                                onClick={() => setConditionFilter(prev => prev.filter(c => c !== condition))}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                            >
                                                {condition}
                                                <X className="h-3 w-3" />
                                            </button>
                                        ))}

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
                                                onClick={() => {
                                                    setMinPrice("")
                                                    setMaxPrice("")
                                                    setMinPriceInput("")
                                                    setMaxPriceInput("")
                                                }}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                            >
                                                {minPrice ? `${minPrice} kr` : '0 kr'}{(minPrice || maxPrice) && " - "}{maxPrice ? `${maxPrice} kr` : 'Any'}
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}

                                        {Object.entries(selectedAttributes).map(([filterName, values]) =>
                                            values.map((value) => (
                                                <button
                                                    key={`${filterName}-${value}`}
                                                    onClick={() => {
                                                        setSelectedAttributes(prev => {
                                                            const newAttrs = { ...prev }
                                                            newAttrs[filterName] = prev[filterName].filter(v => v !== value)
                                                            if (newAttrs[filterName].length === 0) {
                                                                delete newAttrs[filterName]
                                                            }
                                                            return newAttrs
                                                        })
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                                                >
                                                    {value}
                                                    <X className="h-3 w-3" />
                                                </button>
                                            ))
                                        )}

                                        <button
                                            onClick={clearAllFilters}
                                            className="text-sm text-primary hover:underline ml-2"
                                        >
                                            Clear all
                                        </button>
                                    </div>

                                    {/* Divider after filters */}
                                    <div className="border-t my-4"></div>
                                </>
                            )}
                        </div>

                        {/* Listings Section */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-muted-foreground">Loading listings...</p>
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
                                            ? "grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
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
                                        <span className="text-sm text-muted-foreground">
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
                        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-xl overflow-y-auto">
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-muted rounded"
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
                                    <div className="space-y-0">
                                        {['Brand New', 'New', 'Like New', 'Good', 'Fair', 'Poor'].map((condition) => {
                                            const count = conditionCounts[condition as keyof typeof conditionCounts] || 0
                                            const isChecked = conditionFilter.includes(condition)

                                            return (
                                                <label
                                                    key={condition}
                                                    className="w-full flex items-center px-3 py-1 rounded text-sm cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            setConditionFilter(prev =>
                                                                prev.includes(condition)
                                                                    ? prev.filter(c => c !== condition)
                                                                    : [...prev, condition]
                                                            )
                                                        }}
                                                        className="mr-2 h-4 w-4 rounded border-input"
                                                    />
                                                    <span className="flex-1">
                                                        {condition} <span className="text-xs text-muted-foreground font-mono">({count.toLocaleString()})</span>
                                                    </span>
                                                </label>
                                            )
                                        })}
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

                            <div className="p-4 border-t border-border">
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
