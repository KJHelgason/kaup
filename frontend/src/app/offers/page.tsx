"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getMyOffers, respondToOffer, withdrawOffer, Offer } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function OffersPage() {
  const { t } = useLanguage()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([])
  const [sentOffers, setSentOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("received")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // Counter offer state
  const [counterOfferDialogOpen, setCounterOfferDialogOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [counterAmount, setCounterAmount] = useState("")
  const [counterMessage, setCounterMessage] = useState("")
  const [counterOfferError, setCounterOfferError] = useState("")

  // Set initial tab from query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'sent' || tab === 'received') {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch offers
  useEffect(() => {
    if (isAuthenticated) {
      fetchOffers()
    }
  }, [isAuthenticated])

  const fetchOffers = async () => {
    setLoading(true)
    const [received, sent] = await Promise.all([
      getMyOffers('received'),
      getMyOffers('sent')
    ])
    setReceivedOffers(received)
    setSentOffers(sent)
    setLoading(false)
  }

  const handleAcceptOffer = async (offerId: string) => {
    try {
      setActionLoading(offerId)
      await respondToOffer(offerId, 'accept')
      await fetchOffers() // Refresh the list
    } catch (error: any) {
      alert(error.message || t('offerError'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeclineOffer = async (offerId: string) => {
    try {
      setActionLoading(offerId)
      await respondToOffer(offerId, 'decline')
      await fetchOffers() // Refresh the list
    } catch (error: any) {
      alert(error.message || t('offerError'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleWithdrawOffer = async (offerId: string) => {
    try {
      setActionLoading(offerId)
      await withdrawOffer(offerId)
      await fetchOffers() // Refresh the list
    } catch (error: any) {
      alert(error.message || t('offerError'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleOpenCounterOffer = (offer: Offer) => {
    setSelectedOffer(offer)
    setCounterAmount("")
    setCounterMessage("")
    setCounterOfferError("")
    setCounterOfferDialogOpen(true)
  }

  const handleSubmitCounterOffer = async () => {
    if (!selectedOffer) return

    // Validation
    const amount = parseFloat(counterAmount)
    if (isNaN(amount) || amount <= 0) {
      setCounterOfferError(t('counterOfferTooLow'))
      return
    }

    // Check if counter offer is less than listing price
    if (amount >= selectedOffer.listingPrice) {
      setCounterOfferError(t('counterOfferTooHigh'))
      return
    }

    try {
      setActionLoading(selectedOffer.id)
      await respondToOffer(selectedOffer.id, 'counter', amount, counterMessage || undefined)
      setCounterOfferDialogOpen(false)
      await fetchOffers() // Refresh the list
    } catch (error: any) {
      setCounterOfferError(error.message || t('counterOfferError'))
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'Declined':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'Expired':
        return <Clock className="h-5 w-5 text-muted-foreground" />
      default:
        return <ArrowRight className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'Declined':
        return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'Expired':
        return 'text-muted-foreground bg-muted'
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center">{t("loading")}</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-2">{t("myOffers")}</h1>
          <p className="text-muted-foreground mb-8">
            {t("manageYourOffers")}
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="received">{t("offersReceived")} ({receivedOffers.length})</TabsTrigger>
              <TabsTrigger value="sent">{t("offersSent")} ({sentOffers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="mt-6">
              {receivedOffers.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("noOffersReceived")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {receivedOffers.map((offer) => (
                    <Card key={offer.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              <Link href={`/listings/${offer.listingId}`} className="hover:underline">
                                {offer.listingTitle}
                              </Link>
                            </CardTitle>
                            <CardDescription>
                              {t("from")} {offer.buyerName} • {new Date(offer.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            <span className="text-sm font-medium">{offer.status}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("offerAmount")}:</span>
                            <span className="text-2xl font-bold text-primary">
                              {offer.amount.toLocaleString('is-IS')} {t("currency")}
                            </span>
                          </div>
                          
                          {offer.message && (
                            <div>
                              <span className="text-sm text-muted-foreground">{t("message")}:</span>
                              <p className="mt-1 text-sm">{offer.message}</p>
                            </div>
                          )}

                          {offer.status === 'Pending' && (
                            <div className="flex gap-2 pt-4 border-t">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    className="flex-1"
                                    disabled={actionLoading === offer.id}
                                  >
                                    {actionLoading === offer.id ? t("loading") : t("acceptOffer")}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t("acceptOffer")}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t("acceptOfferConfirm").replace('{amount}', offer.amount.toLocaleString('is-IS'))}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t("cancelAction")}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAcceptOffer(offer.id)}>
                                      {t("acceptOffer")}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Button 
                                variant="outline" 
                                className="flex-1"
                                disabled={actionLoading === offer.id}
                                onClick={() => handleOpenCounterOffer(offer)}
                              >
                                {t("counterOffer")}
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    className="flex-1"
                                    disabled={actionLoading === offer.id}
                                  >
                                    {t("declineOffer")}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t("declineOffer")}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t("declineOfferConfirm")}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t("cancelAction")}</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeclineOffer(offer.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {t("declineOffer")}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              {sentOffers.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("noOffersSent")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sentOffers.map((offer) => (
                    <Card key={offer.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              <Link href={`/listings/${offer.listingId}`} className="hover:underline">
                                {offer.listingTitle}
                              </Link>
                            </CardTitle>
                            <CardDescription>
                              {t("to")} {offer.sellerName} • {new Date(offer.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(offer.status)}`}>
                            {getStatusIcon(offer.status)}
                            <span className="text-sm font-medium">{offer.status}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("yourOffer")}:</span>
                            <span className="text-2xl font-bold text-primary">
                              {offer.amount.toLocaleString('is-IS')} {t("currency")}
                            </span>
                          </div>
                          
                          {offer.message && (
                            <div>
                              <span className="text-sm text-muted-foreground">{t("yourMessage")}:</span>
                              <p className="mt-1 text-sm">{offer.message}</p>
                            </div>
                          )}

                          {offer.status === 'Pending' && (
                            <div className="pt-4 border-t">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    className="w-full"
                                    disabled={actionLoading === offer.id}
                                  >
                                    {actionLoading === offer.id ? t("loading") : t("withdrawOffer")}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t("withdrawOffer")}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t("withdrawOfferConfirm")}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t("cancelAction")}</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleWithdrawOffer(offer.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {t("withdrawOffer")}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Counter Offer Dialog */}
      <Dialog open={counterOfferDialogOpen} onOpenChange={setCounterOfferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("counterOfferTitle")}</DialogTitle>
            <DialogDescription>
              {t("counterOfferDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedOffer && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("from")}:</span>
                  <span className="font-medium">{selectedOffer.buyerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("originalOffer")}:</span>
                  <span className="font-bold text-primary">
                    {selectedOffer.amount.toLocaleString('is-IS')} {t("currency")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("price")}:</span>
                  <span className="font-medium">
                    {selectedOffer.listingPrice.toLocaleString('is-IS')} {t("currency")}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="counterAmount" className="text-sm font-medium">
                {t("counterAmount")}
              </label>
              <Input
                id="counterAmount"
                type="number"
                placeholder={t("counterAmountPlaceholder")}
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="counterMessage" className="text-sm font-medium">
                {t("counterMessageOptional")}
              </label>
              <Textarea
                id="counterMessage"
                placeholder={t("offerMessagePlaceholder")}
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                rows={3}
              />
            </div>

            {counterOfferError && (
              <p className="text-sm text-destructive">{counterOfferError}</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCounterOfferDialogOpen(false)}
              disabled={actionLoading === selectedOffer?.id}
            >
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleSubmitCounterOffer}
              disabled={actionLoading === selectedOffer?.id || !counterAmount}
            >
              {actionLoading === selectedOffer?.id ? t("loading") : t("submitCounterOffer")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
