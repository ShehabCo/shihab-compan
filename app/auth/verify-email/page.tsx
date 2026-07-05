import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">تحقق من بريدك الإلكتروني</CardTitle>
              <CardDescription>تم إرسال رابط التفعيل إلى بريدك الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                قمنا بإرسال رسالة تحتوي على رابط تفعيل حسابك. يرجى التحقق من بريدك الإلكتروني والنقر على الرابط لتفعيل
                حسابك والبدء في استخدام المنصة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
