// AI Chat API Endpoint
// واجهة المساعد الذكي

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // معالجة الرسالة باستخدام AI
    const reply = await generateAIResponse(message)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('[Chat] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

/**
 * توليد رد من مساعد ذكي
 */
async function generateAIResponse(message: string): Promise<string> {
  // Simple AI response logic
  // في الإنتاج، يجب استخدام API مثل OpenAI أو Claude

  const lowerMessage = message.toLowerCase()

  // الرد على الأسئلة الشائعة
  if (
    lowerMessage.includes('سعر') ||
    lowerMessage.includes('كم ثمن') ||
    lowerMessage.includes('كم السعر')
  ) {
    return 'يمكنك البحث عن المنتج في متجرنا لمعرفة السعر الحالي. هل تريد أن أساعدك في البحث؟'
  }

  if (
    lowerMessage.includes('شحن') ||
    lowerMessage.includes('توصيل') ||
    lowerMessage.includes('delivery')
  ) {
    return 'نحن نوفر شحن مجاني على جميع الطلبات فوق 100 دولار. يستغرق التوصيل عادة 3-5 أيام عمل.'
  }

  if (
    lowerMessage.includes('إرجاع') ||
    lowerMessage.includes('return') ||
    lowerMessage.includes('استرجاع')
  ) {
    return 'يمكنك إرجاع أي منتج خلال 14 يوماً من الشراء بدون أي أسئلة. سنتولى تكاليف الشحن.'
  }

  if (
    lowerMessage.includes('ضمان') ||
    lowerMessage.includes('guarantee') ||
    lowerMessage.includes('warranty')
  ) {
    return 'جميع منتجاتنا مضمونة 100%. إذا كان هناك أي مشكلة، سنستبدل المنتج أو نسترجع أموالك.'
  }

  if (
    lowerMessage.includes('مساعدة') ||
    lowerMessage.includes('help') ||
    lowerMessage.includes('مشكلة')
  ) {
    return 'أنا هنا لمساعدتك! يمكنك أن تسأل عن المنتجات أو الأسعار أو الشحن أو الإرجاع. كيف يمكنني مساعدتك؟'
  }

  // رد عام
  return 'شكراً لسؤالك! إذا كنت تبحث عن منتج معين، يمكنني مساعدتك. أخبرني عما تحتاجه!'
}
