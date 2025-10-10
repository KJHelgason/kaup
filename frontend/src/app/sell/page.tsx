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
        returnShippingPaidBy: returnsAccepted ? returnShippingPaidBy : undefined
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
