"use client"

import { Header } from "@/components/Header"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getListings, Listing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"

export default function BrowsePage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("")
  const [selectedListingType, setSelectedListingType] = useState(searchParams.get('listingType') || "")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { 
      value: "Rafeindatækni", 
      label: "Rafeindatækni",
      subcategories: [
        { value: "Símar og spjaldtölvur", subSubcategories: ["Snjallsímar", "Spjaldtölvur", "Símahlífar og fylgihlutir", "Hleðslutæki", "Annað"] },
        { value: "Tölvur", subSubcategories: ["Fartölvur", "Borðtölvur", "Tölvuskjáir", "Tölvuhlutir", "Lyklaborð og mýs", "Annað"] },
        { value: "Myndavélar", subSubcategories: ["Stafrænar myndavélar", "Linsa", "Þríróður og búnaður", "Myndavélarhlífar", "Annað"] },
        { value: "Hljóðbúnaður", subSubcategories: ["Heyrnartól", "Hátalara", "Hljómtæki", "Hljóðkerfisbúnaður", "Annað"] },
        { value: "Tölvuleikir & Leikjatölvur", subSubcategories: ["PlayStation", "Xbox", "Nintendo", "Leikir", "Fylgihlutir", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Tíska", 
      label: "Tíska",
      subcategories: [
        { value: "Föt - Karlar", subSubcategories: ["Jakkar og kápur", "Bolir og skyrtur", "Buxur", "Jakkafatnaður", "Íþróttafatnaður", "Annað"] },
        { value: "Föt - Konur", subSubcategories: ["Kjólar", "Bolir og toppar", "Buxur", "Pils", "Jakkar", "Annað"] },
        { value: "Föt - Börn", subSubcategories: ["Drengir", "Stúlkur", "Ungbörn", "Annað"] },
        { value: "Skór", subSubcategories: ["Karlaskór", "Kvennaskór", "Barnaskór", "Íþróttaskór", "Stígvél", "Annað"] },
        { value: "Fylgihlutir", subSubcategories: ["Töskur og veski", "Hattar", "Belti", "Sjal og treflar", "Hanskar", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Heimili & Garður", 
      label: "Heimili & Garður",
      subcategories: [
        { value: "Húsgögn", subSubcategories: ["Sófar og stólar", "Borð", "Rúm", "Skápar", "Hillur", "Annað"] },
        { value: "Eldhúsbúnaður", subSubcategories: ["Pottaefni", "Borðbúnaður", "Smátæki", "Geymsla", "Annað"] },
        { value: "Skraut", subSubcategories: ["Veggskraut", "Kerti", "Púðar", "Teppi", "Ljós", "Annað"] },
        { value: "Verkfæri", subSubcategories: ["Rafverkfæri", "Handverkfæri", "Málningarbúnaður", "Mælikvarðar", "Annað"] },
        { value: "Garðyrkja", subSubcategories: ["Garðverkfæri", "Pottur og krukk", "Fræ og plöntur", "Sláttuvélar", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Íþróttir & Útivist", 
      label: "Íþróttir & Útivist",
      subcategories: [
        { value: "Líkamsræktarbúnaður", subSubcategories: ["Lóð og búnaður", "Jógabúnaður", "Hjólreiðaþjálfar", "Hlaupaborð", "Annað"] },
        { value: "Hjól", subSubcategories: ["Götuhjól", "Fjallahjól", "Rafmagnshjól", "Börn hjól", "Fylgihlutir", "Annað"] },
        { value: "Útivistarfatnaður", subSubcategories: ["Göngufatnaður", "Gönguskór", "Bakpokar", "Tjöld", "Svefnpokar", "Annað"] },
        { value: "Íþróttafatnaður", subSubcategories: ["Hlaupafatnaður", "Íþróttaskór", "Æfingarfatnaður", "Sundföt", "Annað"] },
        { value: "Gönguskíði", subSubcategories: ["Alförin skíði", "Borðskíði", "Skíðastafir", "Hjálmar", "Gleraugu", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Farartæki", 
      label: "Farartæki",
      subcategories: [
        { value: "Bílar", subSubcategories: ["Fólksbílar", "Jeppar", "Sportbílar", "Húsbílar", "Annað"] },
        { value: "Mótorhjól", subSubcategories: ["Götuhjól", "Krosshjól", "Vespuhjól", "Fjórhjól", "Annað"] },
        { value: "Hjólhýsi", subSubcategories: ["Tjaldvagnar", "Húsbílahúsgögn", "Annað"] },
        { value: "Varahlutir", subSubcategories: ["Hjól og dekk", "Hljóðkerfi", "Ljós", "Innri hlutir", "Ytri hlutir", "Annað"] },
        { value: "Fylgihlutir", subSubcategories: ["GPS og hleðsla", "Bifreiðaskraut", "Hreinsiefni", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Bækur, Kvikmyndir & Tónlist", 
      label: "Bækur, Kvikmyndir & Tónlist",
      subcategories: [
        { value: "Bækur", subSubcategories: ["Skáldsögur", "Barnabækur", "Námsbækur", "Ævisögur", "Matreiðslubækur", "Annað"] },
        { value: "Geisladiskar", subSubcategories: ["Kvikmyndir - DVD", "Kvikmyndir - Blu-ray", "Tónlist - CD", "Leikir", "Annað"] },
        { value: "Vínylplötur", subSubcategories: ["Rokk", "Popp", "Jazz", "Klassík", "Annað"] },
        { value: "Hljóðfæri", subSubcategories: ["Gítarar", "Píanó og hljómborð", "Trommur", "Strengir", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Leikföng & Barnabúnaður", 
      label: "Leikföng & Barnabúnaður",
      subcategories: [
        { value: "Leikföng", subSubcategories: ["LEGO og byggingarkubbar", "Dúkkur", "Tölvuleikjaleikföng", "Bílar og vélar", "Spil", "Annað"] },
        { value: "Barnavagnar", subSubcategories: ["Göngukerru", "Kerrur", "Tvíburavagnar", "Fylgihlutir", "Annað"] },
        { value: "Barnastólar", subSubcategories: ["Hásæti", "Bílstólar", "Vaggsófar", "Annað"] },
        { value: "Barnafatnaður", subSubcategories: ["Ungbörn (0-2 ára)", "Smábörn (2-5 ára)", "Börn (6+ ára)", "Skór", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Heilsa & Snyrtivörur", 
      label: "Heilsa & Snyrtivörur",
      subcategories: [
        { value: "Snyrtivörur", subSubcategories: ["Förðun", "Neglur", "Ilmvatn", "Tól", "Annað"] },
        { value: "Húðvörur", subSubcategories: ["Andlitskrem", "Húðhreinsivörur", "Sólarvörn", "Annað"] },
        { value: "Heilsuvörur", subSubcategories: ["Vítamín", "Næringarefni", "Fyrstu hjálp", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Safngripir & List", 
      label: "Safngripir & List",
      subcategories: [
        { value: "Listaverk", subSubcategories: ["Málverk", "Myndir", "Skúlptúrar", "Annað"] },
        { value: "Fornmunir", subSubcategories: ["Húsgögn", "Skartgripir", "Myntir", "Annað"] },
        { value: "Safnkort", subSubcategories: ["Íþróttakort", "Pokémon", "Magic", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Gæludýravörur", 
      label: "Gæludýravörur",
      subcategories: [
        { value: "Hundavörur", subSubcategories: ["Hundfóður", "Leikföng", "Beð", "Hálsbönd og taumar", "Annað"] },
        { value: "Kattavörur", subSubcategories: ["Kattafóður", "Húsgögn", "Leikföng", "Sandkassar", "Annað"] },
        { value: "Fiskar & Búnaður", subSubcategories: ["Fiskabúr", "Síur", "Búnaður", "Fiskur", "Annað"] },
        { value: "Fuglabúnaður", subSubcategories: ["Búr", "Fóður", "Leikföng", "Annað"] },
        { value: "Smádýr", subSubcategories: ["Búr", "Fóður", "Annað"] },
        { value: "Skriðdýr", subSubcategories: ["Terrarium", "Hiti og ljós", "Fóður", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Skartgripir & Úr", 
      label: "Skartgripir & Úr",
      subcategories: [
        { value: "Úr", subSubcategories: ["Karlaúr", "Kvennaúr", "Snjallúr", "Fylgihlutir", "Annað"] },
        { value: "Fínlegir skartgripir", subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"] },
        { value: "Tískuskartgripir", subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"] },
        { value: "Fornir skartgripir", subSubcategories: ["Hringir", "Broskar", "Hálsmen", "Annað"] },
        { value: "Karlaskartgripir", subSubcategories: ["Hringir", "Armbönd", "Hálsmen", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Fyrirtæki & Iðnaður", 
      label: "Fyrirtæki & Iðnaður",
      subcategories: [
        { value: "Veitingahúsabúnaður", subSubcategories: ["Eldhúsbúnaður", "Borðbúnaður", "Kælibúnaður", "Annað"] },
        { value: "Heilbrigðisbúnaður", subSubcategories: ["Læknistæki", "Rannsóknarfæri", "Annað"] },
        { value: "Þungavinnuvélar", subSubcategories: ["Gröfur", "Lyftarar", "Vélar", "Annað"] },
        { value: "Rafbúnaður", subSubcategories: ["Strengir og kabal", "Rofa", "Ljós", "Annað"] },
        { value: "Skrifstofubúnaður", subSubcategories: ["Prentarar", "Pappír", "Húsgögn", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Miðar & Ferðalög", 
      label: "Miðar & Ferðalög",
      subcategories: [
        { value: "Tónleikamiðar", subSubcategories: ["Rokk og Popp", "Klassík", "Jazz", "Annað"] },
        { value: "Íþróttamiðar", subSubcategories: ["Fótbolti", "Körfubolti", "Handbolti", "Annað"] },
        { value: "Viðburðamiðar", subSubcategories: ["Leikhús", "Stand-up", "Viðburðir", "Annað"] },
        { value: "Ferðapakkar", subSubcategories: ["Flug og hótel", "Rútupakkar", "Annað"] },
        { value: "Farangur", subSubcategories: ["Ferðatöskur", "Bakpokar", "Handtöskur", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Þjónusta", 
      label: "Þjónusta",
      subcategories: [
        { value: "Uppboðsþjónusta", subSubcategories: ["Skráning", "Ljósmyndun", "Annað"] },
        { value: "Vef & Tölvuþjónusta", subSubcategories: ["Vefhönnun", "Forritun", "Tölvuviðgerðir", "Annað"] },
        { value: "Prentun", subSubcategories: ["Nafnspjöld", "Merki", "Annað"] },
        { value: "Viðgerðarþjónusta", subSubcategories: ["Tölvur", "Símar", "Annað"] },
        { value: "Listaþjónusta", subSubcategories: ["Ljósmyndun", "Hönnun", "Annað"] },
        { value: "Annað", subSubcategories: [] }
      ]
    },
    { 
      value: "Annað", 
      label: "Annað",
      subcategories: [
        { value: "Annað", subSubcategories: [] }
      ]
    }
  ]

  const loadListings = useCallback(async () => {
    setLoading(true)
    const result = await getListings({
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      subcategory: selectedSubcategory || undefined,
      subSubcategory: selectedSubSubcategory || undefined,
      listingType: selectedListingType || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: currentPage,
      pageSize
    })
    setListings(result.listings)
    setTotalCount(result.totalCount)
    setLoading(false)
  }, [currentPage, searchQuery, selectedCategory, selectedSubcategory, selectedSubSubcategory, selectedListingType, minPrice, maxPrice])

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
    setSelectedSubcategory("")
    setSelectedSubSubcategory("")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalCount / pageSize)
  const hasActiveFilters = searchQuery || selectedCategory || selectedSubcategory || selectedSubSubcategory || minPrice || maxPrice

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
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("")
                      setSelectedSubcategory("")
                      setSelectedSubSubcategory("")
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
                    <div key={category.value}>
                      {/* Main Category Button */}
                      <button
                        onClick={() => {
                          setSelectedCategory(category.value)
                          setSelectedSubcategory("")
                          setSelectedSubSubcategory("")
                          setCurrentPage(1)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {t(category.value)}
                      </button>
                      
                      {/* Subcategories - shown directly below if this category is selected */}
                      {selectedCategory === category.value && category.subcategories.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
                          <button
                            onClick={() => {
                              setSelectedSubcategory("")
                              setSelectedSubSubcategory("")
                              setCurrentPage(1)
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                              !selectedSubcategory
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {t("all")}
                          </button>
                          
                          {category.subcategories.map((subcat) => (
                            <div key={subcat.value}>
                              {/* Subcategory Button */}
                              <button
                                onClick={() => {
                                  setSelectedSubcategory(subcat.value)
                                  setSelectedSubSubcategory("")
                                  setCurrentPage(1)
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                                  selectedSubcategory === subcat.value
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-muted'
                                }`}
                              >
                                {t(subcat.value)}
                              </button>
                              
                              {/* Sub-subcategories - shown directly below if this subcategory is selected */}
                              {selectedSubcategory === subcat.value && subcat.subSubcategories.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/10 pl-2">
                                  <button
                                    onClick={() => {
                                      setSelectedSubSubcategory("")
                                      setCurrentPage(1)
                                    }}
                                    className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors ${
                                      !selectedSubSubcategory
                                        ? 'bg-primary/5 text-primary font-medium'
                                        : 'hover:bg-muted'
                                    }`}
                                  >
                                    {t("all")}
                                  </button>
                                  
                                  {subcat.subSubcategories.map((ssc, index) => (
                                    <button
                                      key={`${subcat.value}-${ssc}-${index}`}
                                      onClick={() => {
                                        setSelectedSubSubcategory(ssc)
                                        setCurrentPage(1)
                                      }}
                                      className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors ${
                                        selectedSubSubcategory === ssc
                                          ? 'bg-primary/5 text-primary font-medium'
                                          : 'hover:bg-muted'
                                      }`}
                                    >
                                      {t(ssc)}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
