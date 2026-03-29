"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useEffect, useRef } from "react"

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">لا توجد رسائل بعد. ابدأ المحادثة!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId

        return (
          <div key={message.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : ""}`}>
              <div
                className={`max-w-md rounded-lg px-4 py-2 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(message.created_at), "p", { locale: ar })}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}
