// AI Shopping Assistant Component
// مساعد التسوق الذكي

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'السلام عليكم! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Send to AI API
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error('[AI Assistant] Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-96 shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">مساعد التسوق الذكي</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-blue-700 p-1 rounded"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              جاري الكتابة...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="اسأل عن المنتجات..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendMessage()
            }
          }}
          disabled={loading}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}

export default AIAssistant
