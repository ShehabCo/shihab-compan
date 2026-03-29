import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `
      *,
      buyer:profiles!conversations_buyer_id_fkey(id, display_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, display_name, avatar_url),
      order:orders(id, status)
    `,
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">الرسائل</h1>
          <p className="text-muted-foreground">محادثاتك مع المشترين والبائعين</p>
        </div>

        {conversations && conversations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {conversations.map((conversation) => {
              const isBuyer = conversation.buyer_id === user.id
              const otherParty = isBuyer
                ? Array.isArray(conversation.seller)
                  ? conversation.seller[0]
                  : conversation.seller
                : Array.isArray(conversation.buyer)
                  ? conversation.buyer[0]
                  : conversation.buyer
              const order = Array.isArray(conversation.order) ? conversation.order[0] : conversation.order

              return (
                <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                  <Card className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherParty?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{otherParty?.display_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-1 flex items-center justify-between">
                            <p className="font-semibold">{otherParty?.display_name}</p>
                            {order && (
                              <Badge variant="outline" className="text-xs">
                                #{order.id.slice(0, 6)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.last_message_at), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
              <MessageSquare className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">لا توجد محادثات بعد</h3>
              <p className="text-center text-muted-foreground">ستظهر محادثاتك مع البائعين والمشترين هنا</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
