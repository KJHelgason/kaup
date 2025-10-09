"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { getCart, removeFromCart, clearCart, CartItem } from "@/lib/api"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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

export default function CartPage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    fetchCart()
  }, [isAuthenticated])

  const fetchCart = async () => {
    setLoading(true)
    const items = await getCart()
    setCartItems(items)
    setLoading(false)
  }

  const handleRemove = async (cartItemId: string) => {
    setRemovingId(cartItemId)
    const success = await removeFromCart(cartItemId)
    if (success) {
      setCartItems(cartItems.filter(item => item.id !== cartItemId))
      toast.success(t('removeFromCart'))
      // Trigger a storage event to update header cart count
      window.dispatchEvent(new Event('cart-updated'))
    } else {
      toast.error('Failed to remove item from cart')
    }
    setRemovingId(null)
  }

  const handleClearCart = async () => {
    setClearing(true)
    const success = await clearCart()
    if (success) {
      setCartItems([])
      toast.success(t('emptyCart'))
      // Trigger a storage event to update header cart count
      window.dispatchEvent(new Event('cart-updated'))
    } else {
      toast.error('Failed to clear cart')
    }
    setClearing(false)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.listingPrice, 0)

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          {t('cart')}
        </h1>
        {cartItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={clearing}>
                {t('clearCart')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('clearCart')}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your cart? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearCart}>
                  {t('clearCart')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{t('emptyCart')}</h2>
              <p className="text-muted-foreground mb-6">
                Start adding items to your cart to see them here.
              </p>
              <Link href="/">
                <Button>
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link href={`/listings/${item.listingId}`}>
                      <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.listingImageUrl ? (
                          <img
                            src={item.listingImageUrl}
                            alt={item.listingTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/listings/${item.listingId}`}>
                        <h3 className="font-semibold text-lg hover:underline line-clamp-1">
                          {item.listingTitle}
                        </h3>
                      </Link>
                      <Link href={`/profile/${item.sellerId}`}>
                        <p className="text-sm text-muted-foreground hover:underline">
                          Sold by {item.sellerName}
                        </p>
                      </Link>
                      <p className="text-xl font-bold mt-2">
                        {item.listingPrice.toLocaleString()} kr
                      </p>
                      {item.listingStatus !== 'Active' && (
                        <p className="text-sm text-destructive mt-1">
                          This item is no longer available
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Items ({cartItems.length})
                  </span>
                  <span>{totalPrice.toLocaleString()} kr</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString()} kr</span>
                </div>
                <Button className="w-full" size="lg">
                  {t('checkout')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
