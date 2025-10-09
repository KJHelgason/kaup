"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, UserPlus } from "lucide-react"
import { useGoogleLogin } from '@react-oauth/google'

export default function RegisterPage() {
  const { t } = useLanguage()
  const { register, googleLogin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError(t("allFieldsRequired") || "All fields are required")
      return
    }

    // Username validation
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      setError("Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens")
      return
    }

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"))
      return
    }

    setLoading(true)

    try {
      await register({
        username,
        email,
        password
      })
      router.push("/") // Redirect to homepage after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : t("registerError"))
      setLoading(false)
    }
  }

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setError("")
      
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })
        
        const userInfo = await userInfoResponse.json()
        
        // Call our backend
        await googleLogin({
          email: userInfo.email,
          googleId: userInfo.sub,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          profileImageUrl: userInfo.picture,
        })
        
        router.push("/")
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Google sign-up failed')
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setError('Google sign-up failed')
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">{t("signUp")}</CardTitle>
              <CardDescription className="text-center">
                {t("signUpDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <Label htmlFor="username">{t("username") || "Username"}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    pattern="[a-zA-Z0-9_-]{3,20}"
                    title="Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    3-20 characters. Letters, numbers, underscores, and hyphens only.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nafn@example.is"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("passwordRequirement")}
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("creatingAccount")}
                    </>
                  ) : (
                    t("createAccount")
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {t("orContinueWith")}
                    </span>
                  </div>
                </div>

                {/* Google Sign-Up Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleGoogleRegister()}
                  disabled={loading || googleLoading}
                  className="w-full"
                  size="lg"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("creatingAccount")}
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {t("signUpWithGoogle")}
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{t("haveAccount")} </span>
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    {t("signIn")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
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
