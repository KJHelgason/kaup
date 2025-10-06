"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createListing } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2 } from "lucide-react"

export default function SellPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [buyNowPrice, setBuyNowPrice] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [listingType, setListingType] = useState("Auction")
  const [endDate, setEndDate] = useState("")

  const categories = [
    "Rafeindatækni",
    "Tíska",
    "Heimili",
    "Íþróttir",
    "Farartæki",
    "Bækur",
    "Leikföng",
    "Garður",
    "Annað"
  ]

  const conditions = [
    { value: "New", labelKey: "conditionNew" },
    { value: "Like New", labelKey: "conditionLikeNew" },
    { value: "Good", labelKey: "conditionGood" },
    { value: "Fair", labelKey: "conditionFair" },
    { value: "Poor", labelKey: "conditionPoor" }
  ]

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

    setLoading(true)

    try {
      const newListing = await createListing({
        title,
        description,
        price: parseFloat(price),
        buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : undefined,
        category,
        condition,
        imageUrls: [], // TODO: Implement image upload
        listingType: listingType,
        isFeatured: false,
        endDate: endDate ? new Date(endDate).toISOString() : undefined
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
      
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">{t("createListing")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("createListingSubtitle")}
          </p>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>{t("listingDetails")}</CardTitle>
                <CardDescription>{t("listingDetailsDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
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
                <div>
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

                {/* Category */}
                <div>
                  <Label htmlFor="category">
                    {t("category")} <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">{t("selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(cat)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
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

                {/* Listing Type */}
                <div>
                  <Label>{t("listingType")} <span className="text-destructive">*</span></Label>
                  <div className="flex gap-4 mt-2">
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
                  </div>
                </div>

                {/* Price */}
                <div>
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
                  <div>
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

                {/* End Date (required for auctions) */}
                {listingType === "Auction" && (
                  <div>
                    <Label htmlFor="endDate">
                      {t("endDate")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("endDateHelp")}
                    </p>
                  </div>
                )}

                {/* Images - Placeholder for future implementation */}
                <div>
                  <Label>{t("images")} ({t("optional")})</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-not-allowed">
                    <ImagePlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("imageUploadComingSoon")}
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-6">
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

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaup. Öll réttindi áskilin.</p>
        </div>
      </footer>
    </div>
  )
}
