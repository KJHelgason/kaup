"use client"

import { Header } from "@/components/Header"
import { categories } from "@/lib/categories"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function AllCategoriesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{t("allCategories")}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {categories.map((category) => (
              <div key={category.value} className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow">
                {/* Category Title */}
                <Link
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors flex items-center gap-2">
                    {t(category.value)}
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </h2>
                </Link>
                
                {/* Subcategories */}
                <ul className="space-y-2">
                  {category.subcategories.filter(sub => sub.value !== "Annað").map((subcat) => (
                    <li key={subcat.value}>
                      <Link
                        href={`/browse?category=${encodeURIComponent(category.value)}&subcategory=${encodeURIComponent(subcat.value)}`}
                        className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {t(subcat.value)}
                      </Link>
                    </li>
                  ))}
                  
                  {/* View All link */}
                  <li className="pt-2">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      {t("viewAll")}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
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
