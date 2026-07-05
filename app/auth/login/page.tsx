"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Mail, Phone, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [step, setStep] = useState<"login" | "verify">("login")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!email || !password) throw new Error("الرجاء ملء جميع الحقول")
      if (!email.includes("@")) throw new Error("البريد الإلكتروني غير صحيح")
      if (password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل")

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      sessionStorage.setItem(`otp_email_${email}`, generatedOtp)
      
      console.log(`[MARA] OTP for ${email}: ${generatedOtp}`)
      
      setSuccessMessage(`تم إرسال رمز التحقق إلى ${email} - الرمز: ${generatedOtp}`)
      setTimeout(() => {
        setStep("verify")
        setSuccessMessage(null)
      }, 1500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "خطأ في تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const cleanPhone = phone.replace(/\D/g, "")
      if (cleanPhone.length < 9) throw new Error("رقم الهاتف غير صحيح")

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      sessionStorage.setItem(`otp_${cleanPhone}`, generatedOtp)
      sessionStorage.setItem("otp_phone", cleanPhone)

      console.log(`[MARA] SMS OTP for ${phone}: ${generatedOtp}`)
      
      setSuccessMessage(`تم إرسال الرمز إلى ${phone} - الرمز: ${generatedOtp}`)
      setTimeout(() => {
        setStep("verify")
        setSuccessMessage(null)
      }, 1500)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (otp.length !== 6) throw new Error("الرمز يجب أن يكون 6 أرقام")

      let savedOtp = null
      
      if (loginMethod === "email") {
        savedOtp = sessionStorage.getItem(`otp_email_${email}`)
      } else {
        const cleanPhone = phone.replace(/\D/g, "")
        savedOtp = sessionStorage.getItem(`otp_${cleanPhone}`)
      }

      if (otp !== savedOtp) throw new Error("رمز التحقق غير صحيح")

      localStorage.setItem("authToken", `token_${Date.now()}`)
      localStorage.setItem("user", JSON.stringify({ 
        [loginMethod === "email" ? "email" : "phone"]: loginMethod === "email" ? email : phone.replace(/\D/g, ""),
        type: loginMethod === "email" ? "email" : "sms"
      }))
      
      sessionStorage.removeItem(`otp_${email}`)
      sessionStorage.removeItem(`otp_${phone}`)
      
      setSuccessMessage("تم التحقق بنجاح!")

      setTimeout(() => router.push("/menu"), 1000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "خطأ في التحقق")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      localStorage.setItem("authToken", `google_${Date.now()}`)
      localStorage.setItem("user", JSON.stringify({ type: "google" }))
      setSuccessMessage("تم تسجيل الدخول عبر Google!")
      setTimeout(() => router.push("/menu"), 1000)
    } catch {
      setError("خطأ في تسجيل الدخول عبر Google")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <Card className="border-amber-400/20 shadow-2xl bg-slate-900/50 backdrop-blur">
          <CardHeader className="text-center bg-gradient-to-b from-amber-400/10 to-transparent border-b border-amber-400/10">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                <span className="text-2xl font-bold text-black">م</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent">
              مرة أم سليم
            </CardTitle>
            <CardDescription className="text-amber-300/70 text-base mt-2">تسجيل الدخول</CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            {error && (
              <Alert className="mb-6 border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-6 border-green-500/30 bg-green-500/10">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs
              value={loginMethod}
              onValueChange={(value) => {
                setLoginMethod(value as "email" | "phone")
                setStep("login")
                setError(null)
                setOtp("")
                setEmail("")
                setPhone("")
                setPassword("")
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-400/10 border border-amber-400/20">
                <TabsTrigger value="email" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                  <Mail className="h-4 w-4 mr-2" />
                  بريد
                </TabsTrigger>
                <TabsTrigger value="phone" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                  <Phone className="h-4 w-4 mr-2" />
                  هاتف
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-amber-300">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-amber-400/20 bg-amber-400/5"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-amber-300">كلمة المرور</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-amber-400/20 bg-amber-400/5"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري..." : "دخول"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={step === "login" ? handlePhoneSubmit : handleOtpSubmit} className="space-y-4">
                  {step === "login" ? (
                    <>
                      <div className="grid gap-2">
                        <Label className="text-amber-300">رقم الهاتف</Label>
                        <Input
                          type="tel"
                          placeholder="+967 77 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-amber-400/20 bg-amber-400/5"
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري..." : "إرسال الرمز"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-300 text-center">تم إرسال الرمز إلى {phone}</p>
                      <Input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        className="border-amber-400/20 bg-amber-400/5 text-center text-2xl tracking-widest"
                        disabled={isLoading}
                        maxLength={6}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                        disabled={isLoading || otp.length !== 6}
                      >
                        {isLoading ? "جاري..." : "تحقق"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep("login")
                          setOtp("")
                          setError(null)
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 w-full"
                      >
                        عودة
                      </button>
                    </>
                  )}
                </form>
              </TabsContent>
              
              <TabsContent value="email">
                <form onSubmit={step === "login" ? handleEmailLogin : handleOtpSubmit} className="space-y-4">
                  {step === "login" ? (
                    <>
                      <div className="grid gap-2">
                        <Label className="text-amber-300">البريد الإلكتروني</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border-amber-400/20 bg-amber-400/5"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-amber-300">كلمة المرور</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border-amber-400/20 bg-amber-400/5"
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                        disabled={isLoading}
                      >
                        {isLoading ? "جاري..." : "إرسال رمز التحقق"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-300 text-center">تم إرسال الرمز إلى {email}</p>
                      <Input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        className="border-amber-400/20 bg-amber-400/5 text-center text-2xl tracking-widest"
                        disabled={isLoading}
                        maxLength={6}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                        disabled={isLoading || otp.length !== 6}
                      >
                        {isLoading ? "جاري..." : "تحقق"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep("login")
                          setOtp("")
                          setError(null)
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 w-full"
                      >
                        عودة
                      </button>
                    </>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-xs text-slate-500">أو</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-amber-400/20 text-amber-300 hover:bg-amber-500/10 h-11 bg-transparent"
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
              دخول عبر Google
            </Button>

            <div className="mt-6 text-center text-sm text-slate-400">
              لا تملك حساب؟{" "}
              <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300 font-semibold">
                أنشئ واحد الآن
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
