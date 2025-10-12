"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Tag } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5075/api'

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

interface CategorySuggestion {
  category: string
  subcategory: string | null
  subSubcategory: string | null
  count: number
}

interface SuggestionResponse {
  titles: string[]
  categories: CategorySuggestion[]
}

export function SearchAutocomplete({ onSearch, placeholder }: SearchAutocompleteProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<CategorySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Calculate total suggestions count
  const totalSuggestions = titleSuggestions.length + categorySuggestions.length

  // Fetch suggestions when query changes
  useEffect(() => {
    console.log('🔄 Query changed:', query, 'Length:', query.length)
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.length < 2) {
      console.log('⚠️ Query too short, clearing suggestions')
      setTitleSuggestions([])
      setCategorySuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        console.log('🔍 Fetching suggestions for query:', query)
        const url = `${API_URL}/listings/search-suggestions?query=${encodeURIComponent(query)}&limit=8`
        console.log('📡 API URL:', url)
        const response = await fetch(url)
        console.log('📥 Response status:', response.status)
        if (response.ok) {
          const data: SuggestionResponse = await response.json()
          console.log('✅ Suggestions received:', data)
          setTitleSuggestions(data.titles || [])
          setCategorySuggestions(data.categories || [])
          setShowSuggestions((data.titles?.length || 0) + (data.categories?.length || 0) > 0)
          console.log('👀 Show suggestions:', (data.titles?.length || 0) + (data.categories?.length || 0) > 0)
        } else {
          const errorText = await response.text()
          console.error('❌ Response not OK:', response.status, response.statusText)
          console.error('❌ Error details:', errorText)
        }
      } catch (error) {
        console.error('❌ Failed to fetch suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < totalSuggestions - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < totalSuggestions) {
          // Determine if it's a title or category suggestion
          if (selectedIndex < titleSuggestions.length) {
            handleTitleClick(titleSuggestions[selectedIndex])
          } else {
            const catIndex = selectedIndex - titleSuggestions.length
            handleCategoryClick(categorySuggestions[catIndex])
          }
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false)
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/browse?search=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleTitleClick = (title: string) => {
    setQuery(title)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    if (onSearch) {
      onSearch(title)
    } else {
      router.push(`/browse?search=${encodeURIComponent(title)}`)
    }
  }

  const handleCategoryClick = (cat: CategorySuggestion) => {
    // Build category path for display
    let categoryPath = cat.category
    if (cat.subcategory) categoryPath += ` > ${cat.subcategory}`
    if (cat.subSubcategory) categoryPath += ` > ${cat.subSubcategory}`
    
    setQuery(categoryPath)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    // Navigate to browse with category filter
    const params = new URLSearchParams()
    params.set('category', cat.category)
    if (onSearch) {
      onSearch(categoryPath)
    } else {
      router.push(`/browse?${params.toString()}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleTitleClick(suggestion)
  }

  const handleClear = () => {
    setQuery("")
    setTitleSuggestions([])
    setCategorySuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Helper function to highlight the matching part
  const highlightMatch = (suggestion: string, query: string) => {
    const lowerSuggestion = suggestion.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const index = lowerSuggestion.indexOf(lowerQuery)
    
    if (index === -1) {
      return <span>{suggestion}</span>
    }
    
    const before = suggestion.slice(0, index)
    const match = suggestion.slice(index, index + query.length)
    const after = suggestion.slice(index + query.length)
    
    return (
      <span>
        {before}
        <strong className="font-semibold">{match}</strong>
        {after}
      </span>
    )
  }

  // Helper to format category path
  const formatCategoryPath = (cat: CategorySuggestion) => {
    const parts = [cat.category]
    if (cat.subcategory) parts.push(cat.subcategory)
    if (cat.subSubcategory) parts.push(cat.subSubcategory)
    return parts.join(' > ')
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (totalSuggestions > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder || (language === "is" ? "Leita að vöru..." : "Search for items...")}
          className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && totalSuggestions > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {/* Title Suggestions */}
          {titleSuggestions.length > 0 && (
            <>
              {titleSuggestions.map((suggestion, index) => (
                <button
                  key={`title-${index}`}
                  onClick={() => handleTitleClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 ${
                    selectedIndex === index ? 'bg-muted' : ''
                  }`}
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{highlightMatch(suggestion, query)}</span>
                </button>
              ))}
            </>
          )}
          
          {/* Category Suggestions */}
          {categorySuggestions.length > 0 && (
            <>
              {titleSuggestions.length > 0 && (
                <div className="border-t my-1"></div>
              )}
              {categorySuggestions.map((cat, index) => {
                const globalIndex = titleSuggestions.length + index
                return (
                  <button
                    key={`cat-${index}`}
                    onClick={() => handleCategoryClick(cat)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 ${
                      selectedIndex === globalIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm">
                        {highlightMatch(formatCategoryPath(cat), query)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cat.count > 0 
                          ? `${cat.count} ${cat.count === 1 ? 'listing' : 'listings'}`
                          : 'Browse category'
                        }
                      </div>
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
