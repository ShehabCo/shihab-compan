import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Clock, Shield, Crown } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/30 bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
              <span className="text-xl font-bold text-white">م</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-yellow-400">مرة أم سليم</h1>
              <p className="text-xs text-muted-foreground">مطعم عربي فاخر</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-foreground hover:text-yellow-400">
              <Link href="/auth/login">دخول</Link>
            </Button>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/auth/signup">إنشاء حساب</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative border-b border-border/30 bg-gradient-to-b from-card to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl animation-float"></div>
        </div>
        <div className="container relative mx-auto px-6 py-24 md:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">مطعم فاخر معروف</span>
            </div>
            <h1 className="mb-8 text-5xl md:text-7xl font-bold leading-tight text-balance">
              <span className="text-yellow-400">مرة أم سليم</span>
              <br />
              تجربة فريدة من الطعام العربي الأصيل
            </h1>
            <p className="mb-12 text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              اكتشف نكهات الطعام العربي التقليدي الفاخر مع أفضل المكونات الطازة والتوصيل السريع إلى باب منزلك
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-14 text-base"
              >
                <Link href="/menu">
                  اطلب الآن
                  <ArrowLeft className="mr-3 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-yellow-500/30 hover:bg-yellow-500/10 h-14 text-base bg-transparent"
              >
                <Link href="/auth/signup">إنشاء حساب جديد</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-center text-4xl font-bold">لماذا تختار مرة أم سليم؟</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">طعام فاخر</h3>
                <p className="text-sm text-muted-foreground">
                  أطباق عربية أصيلة معدة بعناية من أفضل المكونات الطازة يومياً
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">توصيل سريع</h3>
                <p className="text-sm text-muted-foreground">
                  احصل على طلبك في 30-45 دقيقة مع ضمان الحصول على الطعام دافئاً
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                  <Shield className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">توصيل آمن</h3>
                <p className="text-sm text-muted-foreground">معايير صحية عالية وتغليف احترافي لضمان سلامة طعامك</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                  <Crown className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">أسعار حصرية</h3>
                <p className="text-sm text-muted-foreground">عروض خاصة وخصومات للعملاء الدائمين وبرنامج ولاء ممتاز</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/30 bg-gradient-to-r from-card to-card/50 py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold">جاهز للتمتع بتجربة فريدة؟</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              انضم إلينا اليوم واستمتع بأفضل الأطباق العربية الفاخرة مع خدمة توصيل من الدرجة الأولى
            </p>
            <Button
              size="lg"
              asChild
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-14 text-base px-8"
            >
              <Link href="/auth/signup">ابدأ الطلب الآن</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/30 backdrop-blur py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                <span className="text-lg font-bold text-black">م</span>
              </div>
              <div>
                <span className="text-lg font-bold">مرة أم سليم</span>
                <p className="text-xs text-muted-foreground">مطعم عربي فاخر</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 مرة أم سليم - جميع الحقوق محفوظة</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-yellow-400 transition-colors">
                الشروط
              </Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors">
                الخصوصية
              </Link>
              <Link href="#" className="hover:text-yellow-400 transition-colors">
                التواصل
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
