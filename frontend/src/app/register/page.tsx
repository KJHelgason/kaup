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

export default function RegisterPage() {
  const { t } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Validation
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
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined
      })
      router.push("/") // Redirect to homepage after successful registration
    } catch (err: any) {
      setError(err.message || t("registerError"))
      setLoading(false)
    }
  }

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
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
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

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber">
                    {t("phoneNumber")} ({t("optional")})
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="555-1234"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    autoComplete="tel"
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
                  disabled={loading}
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
