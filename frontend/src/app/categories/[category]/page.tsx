"use client"

import { Header } from "@/components/Header"
import { categories, getCategoryBySlug } from "@/lib/categories"
import { useLanguage } from "@/contexts/LanguageContext"
import { getListings, Listing } from "@/lib/api"
import { useEffect, useState, use } from "react"
import Link from "next/link"
import { ListingCard } from "@/components/ListingCard"
import { ChevronRight } from "lucide-react"

interface CategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { t } = useLanguage()
    const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)

    // Unwrap params using React.use()
    const resolvedParams = use(params)
    const categorySlug = resolvedParams.category
    const category = getCategoryBySlug(categorySlug)

    useEffect(() => {
        async function loadFeaturedListings() {
            setLoading(true)
            const result = await getListings({
                category: category?.value || "",
                featured: true,
                pageSize: 8
            })
            setFeaturedListings(result.listings)
            setLoading(false)
        }

        if (category) {
            loadFeaturedListings()
        }
    }, [category])

    if (!category) {
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-muted/30">
                {/* Breadcrumb - Full Width Container */}
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-primary">{t("home")}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link href="/categories" className="hover:text-primary">{t("allCategories")}</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">{t(category.value)}</span>
                    </div>
                </div>

                {/* Category Title */}
                <h1 className="text-4xl font-bold mb-6 px-4">{t(category.value)}</h1>
                {/* Main Layout: Full Width with Sidebar + Content */}
                <div className="flex">
                    {/* Left Sidebar - Fixed to left edge */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 px-4 py-2">
                        {/* Shop by Category */}
                        <div className="mb-6">
                            <h2 className="font-bold text-lg mb-3">{t("shopByCategory")}</h2>
                            <ul className="space-y-2">
                                {category.subcategories.filter(sub => sub.value !== "Annað").map((subcat) => (
                                    <li key={subcat.value}>
                                        <Link
                                            href={`/categories/${category.slug}/${subcat.slug}`}
                                            className="text-sm text-primary hover:underline block"
                                        >
                                            {t(subcat.value)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* View All Link */}
                        <div className="pt-4 border-t">
                            <Link
                                href={`/browse?category=${encodeURIComponent(category.value)}`}
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                {t("viewAll")} {t(category.value)} →
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content - In Container */}
                    <div className="flex-1">
                        <div className="container mx-auto px-4 py-2">
                            {/* Shop by Category Grid with Images */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-semibold mb-4">{t("shopByCategory")}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {category.subcategories.filter(sub => sub.value !== "Annað").map((subcat) => (
                                        <Link
                                            key={subcat.value}
                                            href={`/categories/${category.slug}/${subcat.slug}`}
                                            className="group cursor-pointer block"
                                        >
                                            <div className="space-y-3">
                                                {/* Square Image Placeholder */}
                                                <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                                                    <span className="text-4xl opacity-40">📦</span>
                                                </div>

                                                {/* Title - Floating below image */}
                                                <h3 className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                                                    {t(subcat.value)}
                                                </h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-8 border-border" />

                            {/* Featured Listings (Popular Now) */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-semibold">{t("popularNow")}</h2>
                                    <Link
                                        href={`/browse?category=${encodeURIComponent(category.value)}`}
                                        className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-sm"
                                    >
                                        {t("viewAll")}
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        {t("loading")}
                                    </div>
                                ) : featuredListings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground mb-4">{t("noListingsInCategory")}</p>
                                        <Link
                                            href="/browse"
                                            className="text-primary hover:underline"
                                        >
                                            {t("browseAllListings")}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {featuredListings.map((listing) => (
                                            <ListingCard key={listing.id} listing={listing} />
                                        ))}
                                    </div>
                                )}
                            </div>
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