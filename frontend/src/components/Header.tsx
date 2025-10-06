"use client"

import { Moon, Sun, Search, User, LogOut, LogIn, UserPlus } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function Header() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Top Row - Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg font-bold text-xl">
              K
            </div>
            <span className="text-2xl font-bold hidden sm:inline">Kaup</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('searchPlaceholder')}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'is' ? 'en' : 'is')}
              className="gap-2"
            >
              <span className="text-lg">{language === 'is' ? '🇮🇸' : '🇬🇧'}</span>
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
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

            {/* Sign In / Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="hidden sm:flex gap-2">
                    <User className="h-4 w-4" />
                    {user?.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(`/profile/${user?.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    {t('viewProfile')}
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
          <Link href="/browse" className="hover:text-primary transition-colors">
            {t('browse')}
          </Link>
          <Link href="/sell" className="hover:text-primary transition-colors">
            {t('sell')}
          </Link>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
