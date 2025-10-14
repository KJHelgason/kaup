"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { categories } from "@/lib/categories"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5075/api'

interface SearchWithCategoryProps {
  onSearch?: (query: string, category?: string) => void
  placeholder?: string
}

export function SearchWithCategory({ onSearch, placeholder }: SearchWithCategoryProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLFormElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)


  // Fetch suggestions when query changes
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const url = `${API_URL}/listings/search-suggestions?query=${encodeURIComponent(query)}&limit=8`
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          // Only show title suggestions, not category suggestions
          setSuggestions(data.titles || [])
          const shouldShow = (data.titles?.length || 0) > 0
          setShowSuggestions(shouldShow)
        } else {
          const errorText = await response.text()
        }
      } catch (error) {
        console.error('❌ Failed to fetch suggestions:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      // Check both the button and the menu for category dropdown
      const clickedInsideCategoryButton = categoryRef.current && categoryRef.current.contains(event.target as Node)
      const clickedInsideCategoryMenu = categoryMenuRef.current && categoryMenuRef.current.contains(event.target as Node)
      if (!clickedInsideCategoryButton && !clickedInsideCategoryMenu) {
        setShowCategoryDropdown(false)
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
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
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
      const params = new URLSearchParams()
      params.set('search', query.trim())
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }
      
      if (onSearch) {
        onSearch(query.trim(), selectedCategory || undefined)
      } else {
        router.push(`/browse?${params.toString()}`)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    const params = new URLSearchParams()
    params.set('search', suggestion)
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    
    
    if (onSearch) {
      onSearch(suggestion, selectedCategory || undefined)
    } else {
      router.push(`/browse?${params.toString()}`)
    }
  }

  const handleClear = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleCategorySelect = (categoryValue: string | null) => {
    setSelectedCategory(categoryValue)
    setShowCategoryDropdown(false)
  }

  const getSelectedCategoryLabel = () => {
    if (!selectedCategory) {
      return language === "is" ? "Allir flokkar" : "All Categories"
    }
    const category = categories.find(c => c.value === selectedCategory)
    if (!category) return selectedCategory
    return language === "is" ? category.label : (category.labelEn || category.label)
  }

  // Helper function to highlight the matching part (eBay style: matched part normal, rest bold)
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
        <span className="font-normal">{match}</span>
        <strong className="font-bold">{after}</strong>
      </span>
    )
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        ref={containerRef} 
        className="w-full flex items-center border rounded-full overflow-hidden bg-background"
      >
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder={placeholder || (language === "is" ? "Leita að vöru..." : "Search for items...")}
          className="w-full pl-10 pr-10 py-2 bg-transparent focus:outline-none"
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

      {/* Category Dropdown */}
      <div ref={categoryRef} className="relative border-l">
        <button
          type="button"
          onClick={() => {
            setShowCategoryDropdown(!showCategoryDropdown)
          }}
          className="h-full px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 whitespace-nowrap min-w-[140px]"
        >
          <span className="truncate flex-1 text-left">{getSelectedCategoryLabel()}</span>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </button>
      </div>
      </form>

      {/* Category Dropdown Menu - Outside form to avoid overflow-hidden */}
      {(() => {
        return showCategoryDropdown && (
          <div ref={categoryMenuRef} className="absolute right-0 top-full mt-1 w-64 bg-background border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                selectedCategory === null ? 'bg-primary/10 text-primary font-medium' : ''
              }`}
            >
            {language === "is" ? "Allir flokkar" : "All Categories"}
          </button>
          <div className="border-t my-1"></div>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.value}
              onClick={() => handleCategorySelect(cat.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                selectedCategory === cat.value ? 'bg-primary/10 text-primary font-medium' : ''
              }`}
            >
              {language === "is" ? cat.label : (cat.labelEn || cat.label)}
            </button>
          ))}
        </div>
        )
      })()}

      {/* Suggestions Dropdown */}
      {(() => {
        return showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors flex items-center gap-3 ${
                  selectedIndex === index ? 'bg-muted' : ''
                }`}
              >
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{highlightMatch(suggestion, query)}</span>
              </button>
            ))}
          </div>
        )
      })()}
    </div>
  )
}
