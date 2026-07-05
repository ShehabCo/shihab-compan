import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  delivered: "تم التسليم",
  completed: "مكتمل",
  cancelled: "ملغي",
  disputed: "متنازع عليه",
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch conversation
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(
      `
      *,
      buyer:profiles!conversations_buyer_id_fkey(id, display_name, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, display_name, full_name, avatar_url),
      order:orders(id, status, price, service:services(title))
    `,
    )
    .eq("id", id)
    .single()

  if (error || !conversation) {
    notFound()
  }

  // Check if user is part of this conversation
  if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
    redirect("/messages")
  }

  const isBuyer = conversation.buyer_id === user.id
  const otherParty = isBuyer
    ? Array.isArray(conversation.seller)
      ? conversation.seller[0]
      : conversation.seller
    : Array.isArray(conversation.buyer)
      ? conversation.buyer[0]
      : conversation.buyer
  const order = Array.isArray(conversation.order) ? conversation.order[0] : conversation.order
  const service = order && (Array.isArray(order.service) ? order.service[0] : order.service)

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/messages" className="hover:text-foreground">
              الرسائل
            </Link>
            <span>/</span>
            <span>{otherParty?.display_name}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="flex h-[600px] flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParty?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{otherParty?.display_name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{otherParty?.display_name || otherParty?.full_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{isBuyer ? "البائع" : "المشتري"}</p>
                      </div>
                    </div>
                    {order && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>عرض الطلب</Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6">
                  <MessageList messages={messages || []} currentUserId={user.id} />
                </CardContent>
                <div className="border-t p-4">
                  <MessageInput conversationId={id} senderId={user.id} />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {order && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">معلومات الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">رقم الطلب</p>
                      <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">الخدمة</p>
                      <p className="text-sm font-medium line-clamp-2">{service?.title}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">الحالة</p>
                      <Badge variant="outline" className="text-xs">
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">المبلغ</p>
                      <p className="text-sm font-bold text-primary">${order.price.toFixed(2)}</p>
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link href={`/orders/${order.id}`}>عرض التفاصيل</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
