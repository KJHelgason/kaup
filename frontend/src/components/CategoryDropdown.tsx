"use client"

import { categories } from "@/lib/categories"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CategoryDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CategoryDropdown({ isOpen, onClose }: CategoryDropdownProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  // Show first 9 categories in the grid
  const gridCategories = categories.slice(0, 9)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute left-0 top-full mt-2 w-screen max-w-5xl bg-background border rounded-lg shadow-2xl z-50 p-6">
        {/* 3x3 Grid of Categories */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {gridCategories.map((category) => (
            <div key={category.value} className="space-y-2">
              {/* Category Title */}
              <Link
                href={`/categories/${category.slug}`}
                onClick={onClose}
                className="font-semibold text-base hover:text-primary transition-colors block"
              >
                {t(category.value)}
              </Link>
              
              {/* First 4 Subcategories */}
              <ul className="space-y-1.5">
                {category.subcategories.slice(0, 4).map((subcat) => (
                  <li key={subcat.value}>
                    <Link
                      href={`/browse?category=${encodeURIComponent(category.value)}&subcategory=${encodeURIComponent(subcat.value)}`}
                      onClick={onClose}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {t(subcat.value)}
                    </Link>
                  </li>
                ))}
                
                {/* View All link if there are more subcategories */}
                {category.subcategories.length > 4 && (
                  <li>
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={onClose}
                      className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                      {t("viewAll")}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="border-t my-4" />
        
        {/* All Categories Link */}
        <Link
          href="/categories"
          onClick={onClose}
          className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
        >
          {t("allCategories")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
