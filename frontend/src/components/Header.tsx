"use client"

import { Moon, Sun, User, LogOut, LogIn, UserPlus, Bell, Package, ShoppingCart, Heart, MessageSquare, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, Notification, getCartCount, getUnreadMessageCount, getConversations } from "@/lib/api"
import { CategoryDropdown } from "@/components/CategoryDropdown"
import { SearchWithCategory } from "@/components/SearchWithCategory"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [unreadConversationCount, setUnreadConversationCount] = useState(0)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Fetch unread count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
      fetchCartCount()
      fetchUnreadMessageCount()
      // Poll every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount()
        fetchCartCount()
        fetchUnreadMessageCount()
      }, 30000)
      
      // Listen for cart and message updates
      const handleCartUpdate = () => fetchCartCount()
      const handleMessagesUpdate = () => fetchUnreadMessageCount()
      window.addEventListener('cart-updated', handleCartUpdate)
      window.addEventListener('messages-updated', handleMessagesUpdate)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('cart-updated', handleCartUpdate)
        window.removeEventListener('messages-updated', handleMessagesUpdate)
      }
    }
  }, [isAuthenticated])

  const fetchUnreadCount = async () => {
    const count = await getUnreadNotificationCount()
    setUnreadCount(count)
  }

  const fetchCartCount = async () => {
    const count = await getCartCount()
    setCartCount(count)
  }

  const fetchUnreadMessageCount = async () => {
    const conversations = await getConversations()
    const count = conversations.filter(c => c.unreadCount > 0).length
    setUnreadConversationCount(count)
  }

  const fetchNotifications = async () => {
    setLoadingNotifications(true)
    const data = await getNotifications(false)
    
    // Also fetch recent conversations with unread messages
    const conversations = await getConversations()
    const unreadConversations = conversations.filter(c => c.unreadCount > 0)
    
    // Convert unread conversations to notification format
    // Each conversation becomes ONE notification, but we store the count
    const messageNotifications: Notification[] = unreadConversations.map(c => ({
      id: `msg-${c.userId}`,
      userId: c.userId,
      type: 'message',
      title: c.unreadCount > 1 ? `${c.unreadCount} ${t('newMessage')}s` : t('newMessage'),
      message: `${c.userName}: ${c.lastMessage}`,
      linkUrl: `/messages?userId=${c.userId}`,
      relatedEntityId: c.userId,
      isRead: false,
      createdAt: c.lastMessageTime
    }))
    
    // Combine and sort notifications
    const allNotifications = [...data, ...messageNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    setNotifications(allNotifications)
    setLoadingNotifications(false)
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Handle message notifications differently
    if (notification.type === 'message') {
      // Just navigate to the messages page, don't try to mark as read
      if (notification.linkUrl) {
        router.push(notification.linkUrl)
      }
      // Refresh counts after navigating
      fetchUnreadMessageCount()
      fetchNotifications()
    } else {
      // Handle regular notifications
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id)
        fetchUnreadCount()
        fetchNotifications()
      }
      if (notification.linkUrl) {
        router.push(notification.linkUrl)
      }
    }
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    fetchUnreadCount()
    fetchNotifications()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        {/* Top Row - Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Shop by Category */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg font-bold text-xl">
                K
              </div>
              <span className="text-2xl font-bold hidden sm:inline">Kaup</span>
            </Link>
            
            {/* Shop by Category Button */}
            <div className="relative hidden lg:block">
              <Button
                variant="ghost"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="gap-2"
              >
                {t("shopByCategory")}
                <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </Button>
              
              <CategoryDropdown 
                isOpen={showCategoryDropdown} 
                onClose={() => setShowCategoryDropdown(false)} 
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 hidden md:flex">
            <SearchWithCategory />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'is' ? 'en' : 'is')}
              title={language === 'is' ? 'Switch to English' : 'Skipta yfir á íslensku'}
            >
              <span className="text-2xl">{language === 'is' ? '🇮🇸' : '🇬🇧'}</span>
            </Button>

            {/* Theme Switcher */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications Bell */}
            {isAuthenticated && (
              <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {(unreadCount + unreadConversationCount) > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold">
                        {(unreadCount + unreadConversationCount) > 9 ? '9+' : (unreadCount + unreadConversationCount)}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-2 py-2 border-b">
                    <span className="font-semibold">{t('notifications')}</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="h-auto py-1 px-2 text-xs"
                      >
                        {t('markAllRead')}
                      </Button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {t('loading')}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {t('noNotifications')}
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                            !notification.isRead ? 'bg-muted/50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between w-full gap-2">
                            <span className="font-medium text-sm">{notification.title}</span>
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {notification.message}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleString(language === 'is' ? 'is-IS' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Shopping Cart */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                  <span className="sr-only">{t('cart')}</span>
                </Button>
              </Link>
            )}

            {/* Sign In / Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="hidden sm:flex gap-2">
                    <User className="h-4 w-4" />
                    {user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(`/profile/${user?.username}`)}>
                    <User className="mr-2 h-4 w-4" />
                    {t('viewProfile')}
                  </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/offers')}>
                    <Package className="mr-2 h-4 w-4" />
                    {t('myOffers')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/messages')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('myMessages')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/watchlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    {t('myWatchlist')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('accountSettings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('signIn')}
                </Button>
                <Button variant="default" size="sm" onClick={() => router.push('/register')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('signUp')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Navigation */}
        <nav className="flex items-center gap-6 mt-4 text-sm">
          <Link href="/" className="hover:text-primary transition-colors font-medium">
            {t('home')}
          </Link>
          <Link href="/sell" className="hover:text-primary transition-colors">
            {t('sell')}
          </Link>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <SearchWithCategory />
        </div>
      </div>
    </header>
  )
}
