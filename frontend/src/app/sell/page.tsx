"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createListing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Package, Truck, RefreshCw, Info } from "lucide-react"
import { MultipleImageUpload } from "@/components/MultipleImageUpload"
import { getCategoryFields, CategoryField } from "@/lib/categoryFields"

export default function SellPage() {
  const { t } = useLanguage()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Form state - Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [buyNowPrice, setBuyNowPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [subSubcategory, setSubSubcategory] = useState("")
  const [condition, setCondition] = useState("")
  const [listingType, setListingType] = useState("BuyNow")
  const [endDate, setEndDate] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [acceptOffers, setAcceptOffers] = useState(false)
  
  // Form state - Inventory
  const [quantity, setQuantity] = useState("1")
  
  // Form state - Shipping
  const [itemLocation, setItemLocation] = useState("")
  const [shippingCost, setShippingCost] = useState("0")
  const [shippingMethod, setShippingMethod] = useState("Standard")
  const [handlingTime, setHandlingTime] = useState("3")
  const [internationalShipping, setInternationalShipping] = useState(false)
  
  // Form state - Returns
  const [returnsAccepted, setReturnsAccepted] = useState(false)
  const [returnPeriod, setReturnPeriod] = useState("30")
  const [returnShippingPaidBy, setReturnShippingPaidBy] = useState("Buyer")
  
  // Form state - Category-specific fields (Item Specifics)
  const [categorySpecificFields, setCategorySpecificFields] = useState<Record<string, any>>({})
  
  // Get category-specific fields based on selected category/subcategory/sub-subcategory
  const specificFields = getCategoryFields(category, subcategory, subSubcategory)

  // Reset category-specific fields when category, subcategory, or sub-subcategory changes
  useEffect(() => {
    setCategorySpecificFields({})
  }, [category, subcategory, subSubcategory])

  const categories = [
    { 
      value: "Rafeindatækni", 
      label: "Rafeindatækni",
      subcategories: [
        { 
          value: "Símar og spjaldtölvur", 
          subSubcategories: ["Snjallsímar", "Spjaldtölvur", "Símahlífar og fylgihlutir", "Hleðslutæki", "Annað"]
        },
        { 
          value: "Tölvur", 
          subSubcategories: ["Fartölvur", "Borðtölvur", "Tölvuskjáir", "Tölvuhlutir", "Lyklaborð og mýs", "Annað"]
        },
        { 
          value: "Myndavélar", 
          subSubcategories: ["Stafrænar myndavélar", "Linsa", "Þríróður og búnaður", "Myndavélarhlífar", "Annað"]
        },
        { 
          value: "Hljóðbúnaður", 
          subSubcategories: ["Heyrnartól", "Hátalara", "Hljómtæki", "Hljóðkerfisbúnaður", "Annað"]
        },
        { 
          value: "Tölvuleikir & Leikjatölvur", 
          subSubcategories: ["PlayStation", "Xbox", "Nintendo", "Leikir", "Fylgihlutir", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Tíska", 
      label: "Tíska",
      subcategories: [
        { 
          value: "Föt - Karlar", 
          subSubcategories: ["Jakkar og kápur", "Bolir og skyrtur", "Buxur", "Jakkafatnaður", "Íþróttafatnaður", "Annað"]
        },
        { 
          value: "Föt - Konur", 
          subSubcategories: ["Kjólar", "Bolir og toppar", "Buxur", "Pils", "Jakkar", "Annað"]
        },
        { 
          value: "Föt - Börn", 
          subSubcategories: ["Drengir", "Stúlkur", "Ungbörn", "Annað"]
        },
        { 
          value: "Skór", 
          subSubcategories: ["Karlaskór", "Kvennaskór", "Barnaskór", "Íþróttaskór", "Stígvél", "Annað"]
        },
        { 
          value: "Fylgihlutir", 
          subSubcategories: ["Töskur og veski", "Hattar", "Belti", "Sjal og treflar", "Hanskar", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Heimili & Garður", 
      label: "Heimili & Garður",
      subcategories: [
        { 
          value: "Húsgögn", 
          subSubcategories: ["Sófar og stólar", "Borð", "Rúm", "Skápar", "Hillur", "Annað"]
        },
        { 
          value: "Eldhúsbúnaður", 
          subSubcategories: ["Pottaefni", "Borðbúnaður", "Smátæki", "Geymsla", "Annað"]
        },
        { 
          value: "Skraut", 
          subSubcategories: ["Veggskraut", "Kerti", "Púðar", "Teppi", "Ljós", "Annað"]
        },
        { 
          value: "Verkfæri", 
          subSubcategories: ["Rafverkfæri", "Handverkfæri", "Málningarbúnaður", "Mælikvarðar", "Annað"]
        },
        { 
          value: "Garðyrkja", 
          subSubcategories: ["Garðverkfæri", "Pottur og krukk", "Fræ og plöntur", "Sláttuvélar", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Íþróttir & Útivist", 
      label: "Íþróttir & Útivist",
      subcategories: [
        { 
          value: "Líkamsræktarbúnaður", 
          subSubcategories: ["Lóð og búnaður", "Jógabúnaður", "Hjólreiðaþjálfar", "Hlaupaborð", "Annað"]
        },
        { 
          value: "Hjól", 
          subSubcategories: ["Götuhjól", "Fjallahjól", "Rafmagnshjól", "Börn hjól", "Fylgihlutir", "Annað"]
        },
        { 
          value: "Útivistarfatnaður", 
          subSubcategories: ["Göngufatnaður", "Gönguskór", "Bakpokar", "Tjöld", "Svefnpokar", "Annað"]
        },
        { 
          value: "Íþróttafatnaður", 
          subSubcategories: ["Hlaupafatnaður", "Íþróttaskór", "Æfingarfatnaður", "Sundföt", "Annað"]
        },
        { 
          value: "Gönguskíði", 
          subSubcategories: ["Alförin skíði", "Borðskíði", "Skíðastafir", "Hjálmar", "Gleraugu", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Farartæki", 
      label: "Farartæki",
      subcategories: [
        { 
          value: "Bílar", 
          subSubcategories: ["Fólksbílar", "Jeppar", "Sportbílar", "Húsbílar", "Annað"]
        },
        { 
          value: "Mótorhjól", 
          subSubcategories: ["Götuhjól", "Krosshjól", "Vespuhjól", "Fjórhjól", "Annað"]
        },
        { 
          value: "Hjólhýsi", 
          subSubcategories: ["Tjaldvagnar", "Húsbílahúsgögn", "Annað"]
        },
        { 
          value: "Varahlutir", 
          subSubcategories: ["Hjól og dekk", "Hljóðkerfi", "Ljós", "Innri hlutir", "Ytri hlutir", "Annað"]
        },
        { 
          value: "Fylgihlutir", 
          subSubcategories: ["GPS og hleðsla", "Bifreiðaskraut", "Hreinsiefni", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Bækur, Kvikmyndir & Tónlist", 
      label: "Bækur, Kvikmyndir & Tónlist",
      subcategories: [
        { 
          value: "Bækur", 
          subSubcategories: ["Skáldsögur", "Barnabækur", "Námsbækur", "Ævisögur", "Matreiðslubækur", "Annað"]
        },
        { 
          value: "Geisladiskar", 
          subSubcategories: ["Kvikmyndir - DVD", "Kvikmyndir - Blu-ray", "Tónlist - CD", "Leikir", "Annað"]
        },
        { 
          value: "Vínylplötur", 
          subSubcategories: ["Rokk", "Popp", "Jazz", "Klassík", "Annað"]
        },
        { 
          value: "Hljóðfæri", 
          subSubcategories: ["Gítarar", "Píanó og hljómborð", "Trommur", "Strengir", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Leikföng & Barnabúnaður", 
      label: "Leikföng & Barnabúnaður",
      subcategories: [
        { 
          value: "Leikföng", 
          subSubcategories: ["LEGO og byggingarkubbar", "Dúkkur", "Tölvuleikjaleikföng", "Bílar og vélar", "Spil", "Annað"]
        },
        { 
          value: "Barnavagnar", 
          subSubcategories: ["Göngukerru", "Kerrur", "Tvíburavagnar", "Fylgihlutir", "Annað"]
        },
        { 
          value: "Barnastólar", 
          subSubcategories: ["Hásæti", "Bílstólar", "Vaggsófar", "Annað"]
        },
        { 
          value: "Barnafatnaður", 
          subSubcategories: ["Ungbörn (0-2 ára)", "Smábörn (2-5 ára)", "Börn (6+ ára)", "Skór", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Heilsa & Snyrtivörur", 
      label: "Heilsa & Snyrtivörur",
      subcategories: [
        { 
          value: "Snyrtivörur", 
          subSubcategories: ["Förðun", "Neglur", "Ilmvatn", "Tól", "Annað"]
        },
        { 
          value: "Húðvörur", 
          subSubcategories: ["Andlitskrem", "Húðhreinsivörur", "Sólarvörn", "Annað"]
        },
        { 
          value: "Heilsuvörur", 
          subSubcategories: ["Vítamín", "Næringarefni", "Fyrstu hjálp", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Safngripir & List", 
      label: "Safngripir & List",
      subcategories: [
        { 
          value: "Listaverk", 
          subSubcategories: ["Málverk", "Myndir", "Skúlptúrar", "Annað"]
        },
        { 
          value: "Fornmunir", 
          subSubcategories: ["Húsgögn", "Skartgripir", "Myntir", "Annað"]
        },
        { 
          value: "Safnkort", 
          subSubcategories: ["Íþróttakort", "Pokémon", "Magic", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Gæludýravörur", 
      label: "Gæludýravörur",
      subcategories: [
        { 
          value: "Hundavörur", 
          subSubcategories: ["Hundfóður", "Leikföng", "Beð", "Hálsbönd og taumar", "Annað"]
        },
        { 
          value: "Kattavörur", 
          subSubcategories: ["Kattafóður", "Húsgögn", "Leikföng", "Sandkassar", "Annað"]
        },
        { 
          value: "Fiskar & Búnaður", 
          subSubcategories: ["Fiskabúr", "Síur", "Búnaður", "Fiskur", "Annað"]
        },
        { 
          value: "Fuglabúnaður", 
          subSubcategories: ["Búr", "Fóður", "Leikföng", "Annað"]
        },
        { 
          value: "Smádýr", 
          subSubcategories: ["Búr", "Fóður", "Annað"]
        },
        { 
          value: "Skriðdýr", 
          subSubcategories: ["Terrarium", "Hiti og ljós", "Fóður", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Skartgripir & Úr", 
      label: "Skartgripir & Úr",
      subcategories: [
        { 
          value: "Úr", 
          subSubcategories: ["Karlaúr", "Kvennaúr", "Snjallúr", "Fylgihlutir", "Annað"]
        },
        { 
          value: "Fínlegir skartgripir", 
          subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"]
        },
        { 
          value: "Tískuskartgripir", 
          subSubcategories: ["Hringir", "Hálsmen", "Armbönd", "Eyrnalokkar", "Annað"]
        },
        { 
          value: "Fornir skartgripir", 
          subSubcategories: ["Hringir", "Broskar", "Hálsmen", "Annað"]
        },
        { 
          value: "Karlaskartgripir", 
          subSubcategories: ["Hringir", "Armbönd", "Hálsmen", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Fyrirtæki & Iðnaður", 
      label: "Fyrirtæki & Iðnaður",
      subcategories: [
        { 
          value: "Veitingahúsabúnaður", 
          subSubcategories: ["Eldhúsbúnaður", "Borðbúnaður", "Kælibúnaður", "Annað"]
        },
        { 
          value: "Heilbrigðisbúnaður", 
          subSubcategories: ["Læknistæki", "Rannsóknarfæri", "Annað"]
        },
        { 
          value: "Þungavinnuvélar", 
          subSubcategories: ["Gröfur", "Lyftarar", "Vélar", "Annað"]
        },
        { 
          value: "Rafbúnaður", 
          subSubcategories: ["Strengir og kapal", "Rofa", "Ljós", "Annað"]
        },
        { 
          value: "Skrifstofubúnaður", 
          subSubcategories: ["Prentarar", "Pappír", "Húsgögn", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Miðar & Ferðalög", 
      label: "Miðar & Ferðalög",
      subcategories: [
        { 
          value: "Tónleikamiðar", 
          subSubcategories: ["Rokk og Popp", "Klassík", "Jazz", "Annað"]
        },
        { 
          value: "Íþróttamiðar", 
          subSubcategories: ["Fótbolti", "Körfubolti", "Handbolti", "Annað"]
        },
        { 
          value: "Viðburðamiðar", 
          subSubcategories: ["Leikhús", "Stand-up", "Viðburðir", "Annað"]
        },
        { 
          value: "Ferðapakkar", 
          subSubcategories: ["Flug og hótel", "Rútupakkar", "Annað"]
        },
        { 
          value: "Farangur", 
          subSubcategories: ["Ferðatöskur", "Bakpokar", "Handtöskur", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Þjónusta", 
      label: "Þjónusta",
      subcategories: [
        { 
          value: "Uppboðsþjónusta", 
          subSubcategories: ["Skráning", "Ljósmyndun", "Annað"]
        },
        { 
          value: "Vef & Tölvuþjónusta", 
          subSubcategories: ["Vefhönnun", "Forritun", "Tölvuviðgerðir", "Annað"]
        },
        { 
          value: "Prentun", 
          subSubcategories: ["Nafnspjöld", "Merki", "Annað"]
        },
        { 
          value: "Viðgerðarþjónusta", 
          subSubcategories: ["Tölvur", "Símar", "Annað"]
        },
        { 
          value: "Listaþjónusta", 
          subSubcategories: ["Ljósmyndun", "Hönnun", "Annað"]
        },
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    },
    { 
      value: "Annað", 
      label: "Annað",
      subcategories: [
        { 
          value: "Annað", 
          subSubcategories: []
        }
      ]
    }
  ]

  const conditions = [
    { value: "Brand New", labelKey: "conditionBrandNew" },
    { value: "New", labelKey: "conditionNew" },
    { value: "Like New", labelKey: "conditionLikeNew" },
    { value: "Good", labelKey: "conditionGood" },
    { value: "Fair", labelKey: "conditionFair" },
    { value: "Poor", labelKey: "conditionPoor" }
  ]

  const shippingMethods = [
    { value: "Standard", label: "Standard Shipping" },
    { value: "Express", label: "Express Shipping" },
    { value: "Overnight", label: "Overnight Shipping" },
    { value: "Pickup", label: "Local Pickup Only" }
  ]

  const durationPresets = [
    { days: 1, label: "1 day" },
    { days: 3, label: "3 days" },
    { days: 7, label: "7 days" },
    { days: 10, label: "10 days" },
    { days: 30, label: "30 days" }
  ]

  const setDurationPreset = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setEndDate(date.toISOString().slice(0, 16))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validation
    if (!title || !description || !price || !category || !condition) {
      setError(t("fillRequiredFields"))
      return
    }

    if (parseFloat(price) <= 0) {
      setError(t("priceInvalid"))
      return
    }

    if (buyNowPrice && parseFloat(buyNowPrice) <= parseFloat(price)) {
      setError(t("buyNowPriceInvalid"))
      return
    }

    if (listingType === "Auction" && !endDate) {
      setError(t("endDateRequired"))
      return
    }

    const quantityNum = parseInt(quantity)
    if (quantityNum < 1) {
      setError("Quantity must be at least 1")
      return
    }

    if (!itemLocation?.trim()) {
      setError("Please specify item location")
      return
    }

    // Validate required category-specific fields
    const requiredFields = specificFields.filter(field => field.required)
    for (const field of requiredFields) {
      if (!categorySpecificFields[field.name] || 
          (Array.isArray(categorySpecificFields[field.name]) && categorySpecificFields[field.name].length === 0)) {
        setError(`${t(field.label)} ${t("isRequired")}`)
        return
      }
    }

    if (!user) {
      setError(t("loginRequired"))
      return
    }

    setLoading(true)

    try {
      const newListing = await createListing({
        title,
        description,
        price: parseFloat(price),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : undefined,
        category,
        condition,
        imageUrls: imageUrls,
        listingType: listingType,
        isFeatured: false,
        acceptOffers: acceptOffers,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        sellerId: user.id,
        quantity: quantityNum,
        itemLocation: itemLocation.trim(),
        shippingCost: parseFloat(shippingCost),
        shippingMethod: shippingMethod,
        handlingTime: parseInt(handlingTime),
        internationalShipping: internationalShipping,
        returnsAccepted: returnsAccepted,
        returnPeriod: returnsAccepted ? parseInt(returnPeriod) : undefined,
        returnShippingPaidBy: returnsAccepted ? returnShippingPaidBy : undefined,
        categorySpecificFields: Object.keys(categorySpecificFields).length > 0 ? categorySpecificFields : undefined
      })

      // Redirect to the new listing
      if (newListing) {
        router.push(`/listings/${newListing.id}`)
      } else {
        setError(t("createListingError"))
        setLoading(false)
      }
    } catch (err) {
      setError(t("createListingError"))
      console.error("Error creating listing:", err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {authLoading ? (
        <main className="flex-1 bg-muted/30 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      ) : (
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">{t("createListing")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("createListingSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("listingDetails")}</CardTitle>
                <CardDescription>{t("listingDetailsDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t("title")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder={t("titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {title.length}/100 {t("characters")}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("description")} <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t("descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {description.length}/1000 {t("characters")}
                  </p>
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      {t("category")} <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value)
                        setSubcategory("") // Reset subcategory when main category changes
                        setSubSubcategory("") // Reset sub-subcategory when main category changes
                      }}
                      required
                    >
                      <option value="">{t("selectCategory")}</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {t(cat.value)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">
                      {t("condition")} <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="condition"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      required
                    >
                      <option value="">{t("selectCondition")}</option>
                      {conditions.map((cond) => (
                        <option key={cond.value} value={cond.value}>
                          {t(cond.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subcategory - shown only when category is selected and has subcategories */}
                {category && categories.find(c => c.value === category)?.subcategories && categories.find(c => c.value === category)!.subcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">
                      {t("subcategory")} ({t("optional")})
                    </Label>
                    <select
                      id="subcategory"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={subcategory}
                      onChange={(e) => {
                        setSubcategory(e.target.value)
                        setSubSubcategory("") // Reset sub-subcategory when subcategory changes
                      }}
                    >
                      <option value="">{t("selectSubcategory")}</option>
                      {categories.find(c => c.value === category)!.subcategories.map((subcat) => (
                        <option key={subcat.value} value={subcat.value}>
                          {t(subcat.value)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sub-subcategory - shown only when subcategory is selected and has sub-subcategories */}
                {subcategory && categories.find(c => c.value === category)?.subcategories.find(sc => sc.value === subcategory)?.subSubcategories && categories.find(c => c.value === category)!.subcategories.find(sc => sc.value === subcategory)!.subSubcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subSubcategory">
                      {t("subSubcategory")} ({t("optional")})
                    </Label>
                    <select
                      id="subSubcategory"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={subSubcategory}
                      onChange={(e) => setSubSubcategory(e.target.value)}
                    >
                      <option value="">{t("selectSubSubcategory")}</option>
                      {categories.find(c => c.value === category)!.subcategories.find(sc => sc.value === subcategory)!.subSubcategories.map((ssc) => (
                        <option key={ssc} value={ssc}>
                          {t(ssc)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category-Specific Fields (Item Specifics) */}
                {category && subcategory && specificFields.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{t("itemSpecifics")}</h3>
                      <p className="text-sm text-muted-foreground">{t("itemSpecificsHelp")}</p>
                    </div>
                    
                    <div className="grid gap-4">
                      {specificFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name}>
                            {t(field.label)}{field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          
                          {/* Text Input */}
                          {field.type === 'text' && (
                            <Input
                              id={field.name}
                              type="text"
                              placeholder={field.placeholder}
                              value={categorySpecificFields[field.name] || ''}
                              onChange={(e) => setCategorySpecificFields({
                                ...categorySpecificFields,
                                [field.name]: e.target.value
                              })}
                            />
                          )}
                          
                          {/* Number Input */}
                          {field.type === 'number' && (
                            <div className="flex items-center gap-2">
                              <Input
                                id={field.name}
                                type="number"
                                step="0.01"
                                placeholder={field.placeholder}
                                value={categorySpecificFields[field.name] || ''}
                                onChange={(e) => setCategorySpecificFields({
                                  ...categorySpecificFields,
                                  [field.name]: e.target.value
                                })}
                                className="flex-1"
                              />
                              {field.unit && (
                                <span className="text-sm text-muted-foreground">{field.unit}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Select Dropdown */}
                          {field.type === 'select' && field.options && (
                            <select
                              id={field.name}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={categorySpecificFields[field.name] || ''}
                              onChange={(e) => setCategorySpecificFields({
                                ...categorySpecificFields,
                                [field.name]: e.target.value
                              })}
                            >
                              <option value="">-- {t("select")} --</option>
                              {field.options.map((option) => (
                                <option key={option} value={option}>
                                  {t(option)}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {/* Multiselect (Checkboxes) */}
                          {field.type === 'multiselect' && field.options && (
                            <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                              {field.options.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`${field.name}-${option}`}
                                    checked={(categorySpecificFields[field.name] || []).includes(option)}
                                    onChange={(e) => {
                                      const currentValues = categorySpecificFields[field.name] || []
                                      const newValues = e.target.checked
                                        ? [...currentValues, option]
                                        : currentValues.filter((v: string) => v !== option)
                                      setCategorySpecificFields({
                                        ...categorySpecificFields,
                                        [field.name]: newValues
                                      })
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                  />
                                  <label 
                                    htmlFor={`${field.name}-${option}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {t(option)}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Boolean (Checkbox) */}
                          {field.type === 'boolean' && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={field.name}
                                checked={categorySpecificFields[field.name] || false}
                                onChange={(e) => setCategorySpecificFields({
                                  ...categorySpecificFields,
                                  [field.name]: e.target.checked
                                })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                              />
                              <label 
                                htmlFor={field.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t(field.label)}
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images Upload */}
                <div className="space-y-2">
                  <Label>{t("images")} ({t("optional")})</Label>
                  <MultipleImageUpload
                    onUpload={setImageUrls}
                    currentImages={imageUrls}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("imagesHelp")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Format */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Format</CardTitle>
                <CardDescription>Set your pricing and listing format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Listing Type */}
                <div className="space-y-2">
                  <Label>{t("listingType")} <span className="text-destructive">*</span></Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="listingType"
                        value="BuyNow"
                        checked={listingType === "BuyNow"}
                        onChange={(e) => setListingType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{t("buyNowOnly")}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="listingType"
                        value="Auction"
                        checked={listingType === "Auction"}
                        onChange={(e) => setListingType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{t("auction")}</span>
                    </label>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {listingType === "Auction" ? t("startingPrice") : t("price")} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      min="0"
                      step="100"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {t("currency")}
                    </span>
                  </div>
                </div>

                {/* Buy Now Price (optional for auctions) */}
                {listingType === "Auction" && (
                  <div className="space-y-2">
                    <Label htmlFor="buyNowPrice">
                      {t("buyNowPrice")} ({t("optional")})
                    </Label>
                    <div className="relative">
                      <Input
                        id="buyNowPrice"
                        type="number"
                        placeholder="0"
                        value={buyNowPrice}
                        onChange={(e) => setBuyNowPrice(e.target.value)}
                        min="0"
                        step="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {t("currency")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("buyNowPriceHelp")}
                    </p>
                  </div>
                )}

                {/* Accept Best Offer */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="acceptOffers"
                    checked={acceptOffers}
                    onChange={(e) => setAcceptOffers(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="acceptOffers" className="font-normal cursor-pointer">
                    {t("acceptBestOffer")}
                  </Label>
                </div>

                {/* Duration */}
                {listingType === "Auction" ? (
                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      {t("endDate")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {durationPresets.map((preset) => (
                          <Button
                            key={preset.days}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDurationPreset(preset.days)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("endDateHelp")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Listing Duration</Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {durationPresets.map((preset) => (
                        <Button
                          key={preset.days}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDurationPreset(preset.days)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEndDate("")}
                      >
                        Good 'Til Cancelled
                      </Button>
                    </div>
                    {endDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Ends: {new Date(endDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory
                </CardTitle>
                <CardDescription>Specify how many units are available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity Available <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <Info className="h-3 w-3 inline mr-1" />
                    {listingType === "Auction" 
                      ? "For auctions, only 1 unit can be sold per listing"
                      : "Multiple buyers can purchase this item until stock runs out"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
                <CardDescription>Provide shipping information for buyers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemLocation">
                    Item Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="itemLocation"
                    type="text"
                    placeholder="City or Region (e.g., Reykjavík)"
                    value={itemLocation}
                    onChange={(e) => setItemLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Where the item is located and will ship from
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingMethod">Shipping Method</Label>
                    <select
                      id="shippingMethod"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      {shippingMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingCost">Shipping Cost</Label>
                    <div className="relative">
                      <Input
                        id="shippingCost"
                        type="number"
                        placeholder="0"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                        min="0"
                        step="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {t("currency")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      0 = Free shipping
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="handlingTime">Handling Time (days)</Label>
                    <Input
                      id="handlingTime"
                      type="number"
                      placeholder="3"
                      value={handlingTime}
                      onChange={(e) => setHandlingTime(e.target.value)}
                      min="1"
                      max="30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How many days to ship after purchase
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="internationalShipping"
                      checked={internationalShipping}
                      onChange={(e) => setInternationalShipping(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="internationalShipping" className="font-normal cursor-pointer">
                      Offer International Shipping
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Return Policy
                </CardTitle>
                <CardDescription>Set your return policy for buyers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="returnsAccepted"
                    checked={returnsAccepted}
                    onChange={(e) => setReturnsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="returnsAccepted" className="font-normal cursor-pointer">
                    Accept Returns
                  </Label>
                </div>

                {returnsAccepted && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="returnPeriod">Return Period (days)</Label>
                      <select
                        id="returnPeriod"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={returnPeriod}
                        onChange={(e) => setReturnPeriod(e.target.value)}
                      >
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnShippingPaidBy">Return Shipping Paid By</Label>
                      <select
                        id="returnShippingPaidBy"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={returnShippingPaidBy}
                        onChange={(e) => setReturnShippingPaidBy(e.target.value)}
                      >
                        <option value="Buyer">Buyer</option>
                        <option value="Seller">Seller</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 sticky bottom-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 rounded-lg border shadow-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  t("createListing")
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      )}

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>
    </div>
  )
}
