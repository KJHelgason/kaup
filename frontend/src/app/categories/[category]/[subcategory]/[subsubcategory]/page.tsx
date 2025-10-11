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
            
            // Apply client-side sorting (until backend supports it)
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
            setTotalCount(result.totalCount)
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
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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

                {/* Main Content */}
                <div className="container mx-auto px-4 pb-12">
                    <div className="flex gap-6">
                        {/* Left Sidebar - Filters */}
                        <aside className={`
                            ${showMobileFilters ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : 'hidden'}
                            lg:block lg:sticky lg:top-4 lg:self-start w-full lg:w-64 flex-shrink-0
                        `}>
                            {/* Mobile close button */}
                            <div className="lg:hidden flex justify-between items-center p-4 border-b">
                                <h2 className="font-bold text-lg">{t("filters")}</h2>
                                <button 
                                    onClick={() => setShowMobileFilters(false)}
                                    className="text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="bg-background lg:bg-transparent p-4 lg:p-0 space-y-6">
                                {/* Category Filter - Sub-subcategory selector */}
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                                        {t(subcategory.value)}
                                    </h3>
                                    <div className="space-y-1">
                                        <Link
                                            href={`/categories/${category.slug}/${subcategory.slug}`}
                                            className="block px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                                        >
                                            {language === "is" ? "Allt" : "All"}
                                        </Link>
                                        {subcategory.subSubcategories.map((ssc) => {
                                            const isActive = ssc === subSubcategory
                                            return (
                                                <Link
                                                    key={ssc}
                                                    href={`/categories/${category.slug}/${subcategory.slug}/${toSlug(ssc)}`}
                                                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                                        isActive 
                                                            ? 'bg-primary/10 text-primary font-semibold' 
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    {t(ssc)}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Category-Specific Filters */}
                                {specificFields.map((field) => {
                                    if (field.type === 'select' && field.options) {
                                        return (
                                            <div key={field.name}>
                                                <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                                                    {t(field.label)}
                                                </h3>
                                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                                    <button
                                                        onClick={() => {
                                                            const newFilters = { ...categoryFilters }
                                                            delete newFilters[field.name]
                                                            setCategoryFilters(newFilters)
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                            !categoryFilters[field.name] 
                                                                ? 'bg-primary/10 text-primary font-semibold' 
                                                                : 'hover:bg-muted'
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
                                                            }}
                                                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                                                categoryFilters[field.name] === option 
                                                                    ? 'bg-primary/10 text-primary font-semibold' 
                                                                    : 'hover:bg-muted'
                                                            }`}
                                                        >
                                                            {t(option)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    } else if (field.type === 'number' || field.type === 'text') {
                                        return (
                                            <div key={field.name}>
                                                <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
                                                    {t(field.label)}
                                                </h3>
                                                <input
                                                    type={field.type}
                                                    value={categoryFilters[field.name] || ''}
                                                    onChange={(e) => {
                                                        setCategoryFilters({
                                                            ...categoryFilters,
                                                            [field.name]: e.target.value
                                                        })
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                                    placeholder={t(field.label)}
                                                />
                                            </div>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0">
                            {/* Top Controls Bar */}
                            <div className="bg-background border rounded-lg p-4 mb-6">
                                {/* First Row: Listing Type Slider & Sort/View Controls */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                    {/* Listing Type Slider */}
                                    <div className="flex items-center gap-2 overflow-x-auto">
                                        {listingTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => setListingTypeFilter(type.value)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                                    listingTypeFilter === type.value
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted hover:bg-muted/80'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sort & View Controls */}
                                    <div className="flex items-center gap-4">
                                        {/* Sort Dropdown */}
                                        <div className="relative">
                                            <label className="text-sm font-medium mr-2">
                                                {language === "is" ? "Raða:" : "Sort:"}
                                            </label>
                                            <select
                                                value={sortOption}
                                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                                className="px-3 py-2 border rounded-md text-sm bg-background cursor-pointer pr-8"
                                            >
                                                {sortOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="flex items-center gap-1 border rounded-md p-1">
                                            <button
                                                onClick={() => setViewMode("gallery")}
                                                className={`p-2 rounded transition-colors ${
                                                    viewMode === "gallery"
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                                title={language === "is" ? "Galdrarasýn" : "Gallery View"}
                                            >
                                                <Grid3x3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={`p-2 rounded transition-colors ${
                                                    viewMode === "list"
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                                title={language === "is" ? "Listasýn" : "List View"}
                                            >
                                                <List className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Mobile Filter Toggle */}
                                        <button
                                            onClick={() => setShowMobileFilters(true)}
                                            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                            {t("filters")}
                                        </button>
                                    </div>
                                </div>

                                {/* Horizontal Divider */}
                                <div className="border-t my-4"></div>

                                {/* Results Count */}
                                <div className="text-sm text-muted-foreground">
                                    {loading ? (
                                        language === "is" ? "Hleð..." : "Loading..."
                                    ) : (
                                        <>
                                            {totalCount.toLocaleString()} {language === "is" ? "niðurstöður" : "results"}
                                        </>
                                    )}
                                </div>
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
