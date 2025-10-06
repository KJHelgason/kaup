"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { updateProfile } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Save, Loader2 } from "lucide-react"

export default function AccountPage() {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: "",
    address: "",
    city: "",
    postalCode: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || ""
    })
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      if (!user) return

      const updatedUser = await updateProfile(user.id, formData)
      
      if (!updatedUser) {
        setError(t("updateError"))
        return
      }
      
      setUser(updatedUser)
      setSuccess(true)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || t("updateError"))
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("accountSettings")}</h1>
            <p className="text-muted-foreground">{t("accountSettingsDescription")}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("profileInformation")}
              </CardTitle>
              <CardDescription>{t("updateProfileDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">{t("emailCannotBeChanged")}</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")} ({t("optional")})</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="555-1234"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">{t("bio")} ({t("optional")})</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder={t("bioPlaceholder")}
                    rows={4}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">{t("address")} ({t("optional")})</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Laugavegur 1"
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("city")} ({t("optional")})</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Reykjavík"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t("postalCode")} ({t("optional")})</Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="101"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                    {t("profileUpdated")}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("saveChanges")}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    {t("viewProfile")}
                  </Button>
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
