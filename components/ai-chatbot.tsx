'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا مساعد SmartAI الذكي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    const responses: Record<string, string> = {
      السعر: 'أسعارنا تنافسية جداً! يمكنك تصفح المنتجات لرؤية جميع الأسعار.',
      الشحن: 'نقدم خدمة الشحن السريع إلى جميع أنحاء اليمن. التكلفة تعتمد على الموقع.',
      الدفع: 'نقبل جميع طرق الدفع الآمنة والموثوقة للعملاء لدينا.',
      المنتجات: 'لدينا تشكيلة واسعة من المنتجات عالية الجودة. ما نوع المنتج الذي تبحث عنه؟',
      الضمان: 'جميع منتجاتنا مضمونة 100% وموثوقة. إذا واجهت أي مشكلة، سنحلها لك فوراً.',
      الإرجاع: 'يمكنك إرجاع أي منتج خلال 14 يوماً من الشراء بدون أسئلة.',
      الخصم: 'نقدم خصومات خاصة للعملاء المخلصين والطلبات الكبيرة.',
      الدعم: 'فريق الدعم الخاص بنا متاح 24/7 لمساعدتك في أي استفسار.',
    }

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return value
      }
    }

    // Default AI response
    const defaultResponses = [
      'شكراً لسؤالك! يمكنك زيارة صفحة الأسئلة الشائعة للمزيد من المعلومات.',
      'أنا هنا لمساعدتك! هل لديك أي أسئلة أخرى؟',
      'نحن نسعى دائماً لتقديم أفضل الخدمات. كيف يمكنني مساعدتك بشكل أفضل؟',
      'شكراً لاختيارك SmartAI World! هل تحتاج إلى مزيد من المساعدة؟',
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ar-SA'),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('ar-SA'),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 800)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-40 transition-all"
          aria-label="فتح الدردشة"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-xl z-40 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                AI
              </div>
              <span className="font-semibold">مساعد SmartAI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
              aria-label="إغلاق الدردشة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
