"use client"

import { Header } from "@/components/Header"
import { categories, getCategoryBySlug, getSubcategoryBySlug, toSlug } from "@/lib/categories"
import { getCategoryFields } from "@/lib/categoryFields"
import { useLanguage } from "@/contexts/LanguageContext"
import { getListings, Listing } from "@/lib/api"
import { useEffect, useState, use } from "react"
import Link from "next/link"
import { ListingCard } from "@/components/ListingCard"
import { ChevronRight, Grid3x3, List, ChevronDown, SlidersHorizontal } from "lucide-react"

interface SubSubcategoryPageProps {
    params: Promise<{
        category: string
        subcategory: string
        subsubcategory: string
    }>
}

type ListingTypeFilter = "all" | "auction" | "buyNow" | "bestOffer"
type SortOption = "bestMatch" | "endingSoonest" | "newlyListed" | "priceLowest" | "priceHighest" | "nearestFirst"
type ViewMode = "gallery" | "list"

export default function SubSubcategoryPage({ params }: SubSubcategoryPageProps) {
    const { t, language } = useLanguage()
    const [listings, setListings] = useState<Listing[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    // Filter states
    const [listingTypeFilter, setListingTypeFilter] = useState<ListingTypeFilter>("all")
    const [sortOption, setSortOption] = useState<SortOption>("bestMatch")
    const [viewMode, setViewMode] = useState<ViewMode>("gallery")
    const [categoryFilters, setCategoryFilters] = useState<Record<string, any>>({})
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({})

    // Unwrap params using React.use()
    const resolvedParams = use(params)
    const categorySlug = resolvedParams.category
    const subcategorySlug = resolvedParams.subcategory
    const subSubcategorySlug = resolvedParams.subsubcategory

    const category = getCategoryBySlug(categorySlug)
    const subcategory = category ? getSubcategoryBySlug(category, subcategorySlug) : undefined

    // Decode the sub-subcategory from URL slug
    const subSubcategory = subcategory?.subSubcategories.find(
        ssc => toSlug(ssc) === subSubcategorySlug
    )

    // Get category-specific fields for this sub-subcategory
    const specificFields = category && subcategory && subSubcategory
        ? getCategoryFields(category.value, subcategory.value, subSubcategory)
        : []

    // Don't auto-initialize sub-subcategory filter - the page route already handles this
    // The API filters by subSubcategory parameter automatically

    useEffect(() => {
        async function loadListings() {
            if (!category || !subcategory || !subSubcategory) return

            setLoading(true)

            // Build API params based on filters
            const apiParams: any = {
                category: category.value,
                subcategory: subcategory.value,
                subSubcategory: subSubcategory,
                page: currentPage,
                pageSize: 48
            }

            // Apply listing type filter
            if (listingTypeFilter === "auction") {
                apiParams.listingType = "auction"
            } else if (listingTypeFilter === "buyNow") {
                apiParams.listingType = "buyNow"
            } else if (listingTypeFilter === "bestOffer") {
                apiParams.acceptOffers = true
            }

            // Apply category-specific filters
            Object.entries(categoryFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    apiParams[`filter_${key}`] = value
                }
            })

            const result = await getListings(apiParams)

            console.log('🔍 Filtering Debug:', {
                totalListings: result.listings.length,
                activeFilters: categoryFilters,
                sampleListingFields: result.listings[0]?.categorySpecificFields
            })

            // Apply client-side filtering on categorySpecificFields
            let filteredListings = result.listings.filter(listing => {
                // Check each category filter
                for (const [filterKey, filterValue] of Object.entries(categoryFilters)) {
                    // Skip the subSubcategory filter (already handled by API)
                    if (filterKey === 'subSubcategory') continue
                    
                    // Skip if no filter value set
                    if (!filterValue || filterValue === '') continue
                    
                    // Get the value from listing's categorySpecificFields
                    const listingValue = listing.categorySpecificFields?.[filterKey]
                    
                    console.log(`  Checking ${listing.title}:`, {
                        filterKey,
                        filterValue,
                        listingValue,
                        match: listingValue === filterValue
                    })
                    
                    // If listing doesn't have this field, exclude it
                    if (listingValue === undefined || listingValue === null) {
                        return false
                    }
                    
                    // Compare values (case-insensitive for strings)
                    if (typeof filterValue === 'string' && typeof listingValue === 'string') {
                        if (listingValue.toLowerCase() !== filterValue.toLowerCase()) {
                            return false
                        }
                    } else if (filterValue !== listingValue) {
                        return false
                    }
                }
                
                return true
            })

            console.log('✅ Filtered Results:', {
                beforeFiltering: result.listings.length,
                afterFiltering: filteredListings.length
            })

            // Apply client-side sorting (until backend supports it)
            let sortedListings = [...filteredListings]
            switch (sortOption) {
                case "endingSoonest":
                    sortedListings.sort((a, b) => {
                        if (!a.endDate) return 1
                        if (!b.endDate) return -1
                        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
                    })
                    break
                case "newlyListed":
                    sortedListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    break
                case "priceLowest":
                    sortedListings.sort((a, b) => a.price - b.price)
                    break
                case "priceHighest":
                    sortedListings.sort((a, b) => b.price - a.price)
                    break
                case "nearestFirst":
                    // Would need geolocation - placeholder for now
                    break
                default: // bestMatch
                    // Use default API ordering
                    break
            }

            setListings(sortedListings)
            setTotalCount(sortedListings.length)
            setLoading(false)
        }

        loadListings()
    }, [category, subcategory, subSubcategory, currentPage, listingTypeFilter, sortOption, categoryFilters])

    if (!category || !subcategory || !subSubcategory) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">{t("categoryNotFound")}</h1>
                        <Link href="/categories" className="text-primary hover:underline">
                            {t("backToCategories")}
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    const listingTypes: { value: ListingTypeFilter; label: string }[] = [
        { value: "all", label: language === "is" ? "Allt" : "All Listings" },
        { value: "auction", label: language === "is" ? "Uppboð" : "Auction" },
        { value: "buyNow", label: language === "is" ? "Kaupa núna" : "Buy It Now" },
        { value: "bestOffer", label: language === "is" ? "Besta tilboð" : "Best Offer" }
    ]

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: "bestMatch", label: language === "is" ? "Besta samsvörun" : "Best Match" },
        { value: "endingSoonest", label: language === "is" ? "Endar fyrst" : "Time: ending soonest" },
        { value: "newlyListed", label: language === "is" ? "Nýlega skráð" : "Time: newly listed" },
        { value: "priceLowest", label: language === "is" ? "Verð: lægst" : "Price: lowest" },
        { value: "priceHighest", label: language === "is" ? "Verð: hæst" : "Price: highest" },
        { value: "nearestFirst", label: language === "is" ? "Nálægast fyrst" : "Distance: nearest first" }
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-muted/30">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary">{t("home")}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/categories" className="hover:text-primary">{t("allCategories")}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/categories/${category.slug}`} className="hover:text-primary">{t(category.value)}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href={`/categories/${category.slug}/${subcategory.slug}`} className="hover:text-primary">{t(subcategory.value)}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">{t(subSubcategory)}</span>
                    </div>
                </div>

                {/* Category Title */}
                <h1 className="text-4xl font-bold mb-6 px-4">{t(subSubcategory)}</h1>
                {/* Main Layout: Full Width with Sidebar + Content */}
                <div className="flex">
                    {/* Left Sidebar - Navigation Tree */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 px-4 py-2">
                        {/* Shop by Category */}
                        <div className="mb-6">
                            <h2 className="font-bold text-lg mb-3">{t("shopByCategory")}</h2>

                            {/* Category Link */}
                            <Link
                                href={`/categories/${category.slug}`}
                                className="text-sm text-primary hover:underline block mb-2"
                            >
                                {t(category.value)}
                            </Link>

                            {/* Subcategory Link */}
                            <div className="ml-4 mb-2">
                                <Link
                                    href={`/categories/${category.slug}/${subcategory.slug}`}
                                    className="text-sm text-primary hover:underline block"
                                >
                                    {t(subcategory.value)}
                                </Link>
                            </div>

                            {/* Sub-subcategories */}
                            <div className="ml-8 space-y-1">
                                {subcategory.subSubcategories.filter(ssc => ssc !== "Annað").map((ssc) => {
                                    const isActive = ssc === subSubcategory
                                    return (
                                        <Link
                                            key={ssc}
                                            href={`/categories/${category.slug}/${subcategory.slug}/${toSlug(ssc)}`}
                                            className={`text-sm block ${isActive
                                                ? 'text-primary font-semibold'
                                                : 'text-muted-foreground hover:underline'
                                                }`}
                                        >
                                            {t(ssc)}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* View All Link */}
                        <div className="pt-4 border-t">
                            <Link
                                href={`/categories/${category.slug}/${subcategory.slug}`}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {t("viewAll")} {t(subcategory.value)} →
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content Area - In Container */}
                    <div className="flex-1 min-w-0">
                        <div className="container mx-auto px-4 pb-12">
                            {/* Top Controls Bar */}
                            <div className="p-4 pb-0">
                                {/* First Row: Listing Type Slider & Sort/View Controls */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                    {/* Listing Type Slider */}
                                    <div className="bg-background border-1 rounded-full flex items-center gap-2 overflow-x-auto p-0.5">
                                        {listingTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => setListingTypeFilter(type.value)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${listingTypeFilter === type.value
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted/80'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort & View Controls */}
                                    <div className="flex items-center gap-4">
                                        {/* Sort Dropdown - Custom */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                                className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm bg-background hover:bg-muted transition-colors"
                                            >
                                                <span className="font-medium">{language === "is" ? "Raða:" : "Sort:"}</span>
                                                <span>{sortOptions.find(o => o.value === sortOption)?.label}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </button>

                                            {showSortDropdown && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setShowSortDropdown(false)}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-20">
                                                        {sortOptions.map((option) => (
                                                            <button
                                                                key={option.value}
                                                                onClick={() => {
                                                                    setSortOption(option.value)
                                                                    setShowSortDropdown(false)
                                                                }}
                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${sortOption === option.value ? 'bg-primary/10 text-primary font-medium' : ''
                                                                    }`}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="flex items-center gap-1 border rounded-md p-1">
                                            <button
                                                onClick={() => setViewMode("gallery")}
                                                className={`p-2 rounded transition-colors ${viewMode === "gallery"
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                title={language === "is" ? "Galdrarasýn" : "Gallery View"}
                                            >
                                                <Grid3x3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={`p-2 rounded transition-colors ${viewMode === "list"
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                                    }`}
                                                title={language === "is" ? "Listasýn" : "List View"}
                                            >
                                                <List className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Mobile Filter Toggle - Removed, filters now always visible */}
                                    </div>
                                </div>

                                {/* Results Count */}
                                <div className="text-sm text-muted-foreground mb-4">
                                    {loading ? (
                                        language === "is" ? "Hleð..." : "Loading..."
                                    ) : (
                                        <>
                                            {totalCount.toLocaleString()} {language === "is" ? "niðurstöður" : "results"}
                                        </>
                                    )}
                                </div>

                                {/* Horizontal Divider */}
                                <div className="border-t my-4"></div>

                                {/* Active Filters & Filter Dropdowns - Below Results */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    {/* Active Filters (with remove buttons) */}
                                    {Object.entries(categoryFilters).filter(([key]) => key !== 'subSubcategory').map(([fieldName, value]) => {
                                        const field = specificFields.find(f => f.name === fieldName)
                                        if (!field || !value) return null

                                        return (
                                            <div
                                                key={fieldName}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                                            >
                                                <span>{t(value)}</span>
                                                <button
                                                    onClick={() => {
                                                        const newFilters = { ...categoryFilters }
                                                        delete newFilters[fieldName]
                                                        setCategoryFilters(newFilters)
                                                    }}
                                                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                                    aria-label="Remove filter"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )
                                    })}

                                    {/* Separator - Only show if there are other active filters */}
                                    {Object.keys(categoryFilters).filter(k => k !== 'subSubcategory').length > 0 && (
                                        <div className="h-8 w-px bg-border"></div>
                                    )}

                                    {/* Other Filter Selection Buttons */}
                                    {specificFields.map((field) => {
                                        if (field.type === 'select' && field.options) {
                                            const isExpanded = expandedFilters[field.name]
                                            const selectedValue = categoryFilters[field.name]

                                            // Don't show if there's an active filter for this field
                                            if (selectedValue) return null

                                            return (
                                                <div key={field.name} className="relative">
                                                    <button
                                                        onClick={() => setExpandedFilters(prev => ({
                                                            ...prev,
                                                            [field.name]: !prev[field.name]
                                                        }))}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm bg-background hover:bg-muted transition-colors whitespace-nowrap"
                                                    >
                                                        <span>{t(field.label)}</span>
                                                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''
                                                            }`} />
                                                    </button>

                                                    {isExpanded && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() => setExpandedFilters(prev => ({
                                                                    ...prev,
                                                                    [field.name]: false
                                                                }))}
                                                            />
                                                            <div className="absolute left-0 mt-2 bg-background border rounded-md shadow-lg z-20 max-h-64 overflow-y-auto min-w-[200px]">
                                                                <button
                                                                    onClick={() => {
                                                                        const newFilters = { ...categoryFilters }
                                                                        delete newFilters[field.name]
                                                                        setCategoryFilters(newFilters)
                                                                        setExpandedFilters(prev => ({
                                                                            ...prev,
                                                                            [field.name]: false
                                                                        }))
                                                                    }}
                                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${!categoryFilters[field.name]
                                                                        ? 'bg-primary/10 text-primary font-medium'
                                                                        : ''
                                                                        }`}
                                                                >
                                                                    {language === "is" ? "Allt" : "All"}
                                                                </button>
                                                                {field.options.map((option) => (
                                                                    <button
                                                                        key={option}
                                                                        onClick={() => {
                                                                            setCategoryFilters({
                                                                                ...categoryFilters,
                                                                                [field.name]: option
                                                                            })
                                                                            setExpandedFilters(prev => ({
                                                                                ...prev,
                                                                                [field.name]: false
                                                                            }))
                                                                        }}
                                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${categoryFilters[field.name] === option
                                                                            ? 'bg-primary/10 text-primary font-medium'
                                                                            : ''
                                                                            }`}
                                                                    >
                                                                        {t(option)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                </div>
                                {/* Horizontal Divider */}
                                <div className="border-t my-4"></div>
                            </div>

                            {/* Listings Grid/List */}
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">{language === "is" ? "Hleð skráningum..." : "Loading listings..."}</p>
                                    </div>
                                </div>
                            ) : listings.length === 0 ? (
                                <div className="bg-background border rounded-lg p-12 text-center">
                                    <p className="text-lg text-muted-foreground">
                                        {language === "is" ? "Engar skráningar fundust" : "No listings found"}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {language === "is" ? "Prófaðu að breyta síunum þínum" : "Try adjusting your filters"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {viewMode === "gallery" ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {listings.map((listing) => (
                                                <ListingCard key={listing.id} listing={listing} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {listings.map((listing) => (
                                                <Link
                                                    key={listing.id}
                                                    href={`/listing/${listing.id}`}
                                                    className="flex gap-4 bg-background border rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="w-32 h-32 flex-shrink-0">
                                                        <img
                                                            src={listing.thumbnailUrls?.[0] || listing.imageUrls?.[0] || '/placeholder.png'}
                                                            alt={listing.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg mb-2 truncate">{listing.title}</h3>
                                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                            {listing.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-lg font-bold text-primary">
                                                                {listing.price.toLocaleString()} kr
                                                            </span>
                                                            {listing.listingType === 'auction' && (
                                                                <span className="text-muted-foreground">
                                                                    {listing.bidCount} {language === "is" ? "boð" : "bids"}
                                                                </span>
                                                            )}
                                                            <span className="text-muted-foreground capitalize">
                                                                {t(listing.condition)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalCount > 48 && (
                                        <div className="flex justify-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                                            >
                                                {language === "is" ? "Fyrri" : "Previous"}
                                            </button>
                                            <span className="px-4 py-2">
                                                {language === "is" ? "Síða" : "Page"} {currentPage} {language === "is" ? "af" : "of"} {Math.ceil(totalCount / 48)}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => p + 1)}
                                                disabled={currentPage >= Math.ceil(totalCount / 48)}
                                                className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                                            >
                                                {language === "is" ? "Næsta" : "Next"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
