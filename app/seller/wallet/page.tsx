import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

const transactionTypeLabels: Record<string, string> = {
  earning: "أرباح",
  withdrawal: "سحب",
  refund: "استرداد",
  commission: "عمولة",
}

const transactionStatusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  completed: "مكتمل",
  failed: "فشل",
  cancelled: "ملغي",
}

export default async function SellerWalletPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a seller
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "seller") {
    redirect("/dashboard")
  }

  // Fetch or create wallet
  let { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  if (!wallet) {
    // Create wallet if it doesn't exist
    const { data: newWallet } = await supabase
      .from("wallets")
      .insert({
        user_id: user.id,
        balance: 0,
        pending_balance: 0,
        total_earned: 0,
        total_withdrawn: 0,
      })
      .select()
      .single()

    wallet = newWallet
  }

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("wallet_id", wallet?.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">المحفظة</h1>
          <p className="text-muted-foreground">إدارة أرباحك وسحب الأموال</p>
        </div>

        {/* Wallet Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الرصيد المتاح</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${wallet?.balance.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">جاهز للسحب</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الرصيد المعلق</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${wallet?.pending_balance.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">في انتظار التسليم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${wallet?.total_earned.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">منذ البداية</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المسحوبات</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${wallet?.total_withdrawn.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-muted-foreground">تم سحبها</p>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>سحب الأموال</CardTitle>
            <CardDescription>اسحب أرباحك إلى حسابك البنكي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الحد الأدنى للسحب: $50</p>
                <p className="text-sm text-muted-foreground">مدة المعالجة: 3-5 أيام عمل</p>
              </div>
              <Button disabled={(wallet?.balance || 0) < 50}>طلب سحب</Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions History */}
        <Card>
          <CardHeader>
            <CardTitle>سجل المعاملات</CardTitle>
            <CardDescription>آخر المعاملات على محفظتك</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === "earning"
                            ? "bg-primary/10"
                            : transaction.type === "withdrawal"
                              ? "bg-destructive/10"
                              : "bg-muted"
                        }`}
                      >
                        {transaction.type === "earning" ? (
                          <ArrowDownRight className="h-5 w-5 text-primary" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transactionTypeLabels[transaction.type]}</p>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "earning" ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {transaction.type === "earning" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {transactionStatusLabels[transaction.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Wallet className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد معاملات بعد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
