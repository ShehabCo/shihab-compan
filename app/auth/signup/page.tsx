"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Phone, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [step, setStep] = useState<"info" | "verify">("info")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms">("email")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        throw new Error("الرجاء ملء جميع الحقول")
      }

      if (!email.includes("@")) {
        throw new Error("البريد الإلكتروني غير صحيح")
      }

      const cleanPhone = phone.replace(/\D/g, "")
      if (cleanPhone.length < 9) {
        throw new Error("رقم الهاتف غير صحيح")
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      
      if (verificationMethod === "email") {
        sessionStorage.setItem(`otp_verify_${email}`, generatedOtp)
        console.log(`[MARA] Verification OTP for ${email}: ${generatedOtp}`)
      } else {
        sessionStorage.setItem(`otp_sms_${cleanPhone}`, generatedOtp)
        console.log(`[MARA] SMS Verification OTP for ${phone}: ${generatedOtp}`)
      }

      localStorage.setItem(
        "signupData",
        JSON.stringify({
          fullName,
          email,
          phone: cleanPhone,
          verificationMethod,
        }),
      )

      setSuccessMessage(
        `تم إرسال رمز التحقق إلى ${verificationMethod === "email" ? email : phone}. الرمز: ${generatedOtp}`
      )

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
            <CardDescription className="text-amber-300/70 text-base mt-2">إنشاء حساب جديد</CardDescription>
          </CardHeader>
          <CardContent className="mt-8">
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

            {step === "info" ? (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-amber-300 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    الاسم الكامل
                  </Label>
                  <Input
                    type="text"
                    placeholder="علي محمد أحمد"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-amber-400/20 bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-amber-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-amber-400/20 bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-amber-300 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    رقم الهاتف
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+967 77 123 4567"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-amber-400/20 bg-amber-400/5 focus:border-amber-400 focus:bg-amber-400/10"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-3 pt-2">
                  <Label className="text-amber-300">طريقة التحقق</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("email")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        verificationMethod === "email"
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-amber-400/20 bg-transparent hover:border-amber-400/40"
                      }`}
                    >
                      <Mail className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">البريد الإلكتروني</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod("sms")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        verificationMethod === "sms"
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-amber-400/20 bg-transparent hover:border-amber-400/40"
                      }`}
                    >
                      <Phone className="h-4 w-4 mx-auto mb-1" />
                      <span className="text-xs">رسالة نصية</span>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري المعالجة..." : "إنشاء الحساب"}
                </Button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault()
                setIsLoading(true)
                const signupData = JSON.parse(localStorage.getItem("signupData") || "{}")
                const savedOtp = verificationMethod === "email" 
                  ? sessionStorage.getItem(`otp_verify_${signupData.email}`)
                  : sessionStorage.getItem(`otp_sms_${signupData.phone}`)
                
                if (otp === savedOtp) {
                  localStorage.setItem("authToken", `token_${Date.now()}`)
                  localStorage.setItem("user", JSON.stringify(signupData))
                  sessionStorage.removeItem(`otp_verify_${signupData.email}`)
                  sessionStorage.removeItem(`otp_sms_${signupData.phone}`)
                  setSuccessMessage("تم إنشاء الحساب بنجاح!")
                  setTimeout(() => router.push("/menu"), 1000)
                } else {
                  setError("رمز التحقق غير صحيح")
                }
                setIsLoading(false)
              }} className="space-y-4">
                <p className="text-center text-sm text-slate-300">
                  تم إرسال رمز التحقق إلى {verificationMethod === "email" ? email : phone}
                </p>
                <Input
                  type="text"
                  placeholder="أدخل رمز التحقق 6 أرقام"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  maxLength={6}
                  className="border-amber-400/20 bg-amber-400/5 focus:border-amber-400 text-center tracking-widest text-2xl"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold h-11"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "جاري التحقق..." : "تحقق وأنشئ الحساب"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-slate-400">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
