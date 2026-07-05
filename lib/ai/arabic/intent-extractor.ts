// Arabic Intent Extraction Engine
// يستخرج نية المستخدم من النصوص العربية

import type { IntentType, IntentAnalysis } from './types'

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  shopping_inquiry: [
    'أشتري',
    'اشتري',
    'أشترى',
    'اشترى',
    'بتاع',
    'أدور',
    'أبحث',
    'عندك',
    'في',
    'هل عندك',
    'سعر',
    'كم',
    'بكم',
    'غالي',
    'رخيص',
  ],
  price_negotiation: [
    'سعر',
    'كم السعر',
    'بكم',
    'غالي',
    'رخيص',
    'أقل',
    'أكثر',
    'خصم',
    'عرض',
    'تخفيف',
    'أنقص',
  ],
  product_recommendation: [
    'أنسب',
    'أحسن',
    'أفضل',
    'يجب',
    'ننصح',
    'اقترح',
    'أنا محتاج',
    'أحتاج',
    'أرغب',
    'أريد',
  ],
  support_request: [
    'مساعدة',
    'يساعد',
    'مشكلة',
    'خطأ',
    'لا يعمل',
    'عطل',
    'يضايق',
    'لا أقدر',
    'أستطيع',
  ],
  delivery_inquiry: [
    'توصيل',
    'شحن',
    'وصول',
    'متى',
    'كم الوقت',
    'السرعة',
    'سريع',
    'بطيء',
  ],
  payment_issue: [
    'دفع',
    'فلوس',
    'مال',
    'بطاقة',
    'حساب',
    'محفظة',
    'رصيد',
    'تحويل',
  ],
  product_quality: [
    'جودة',
    'جيد',
    'سيء',
    'ممتاز',
    'حسن',
    'وحش',
    'مزيان',
    'ضعيف',
    'قوي',
  ],
  personal_preference: [
    'أحب',
    'أحمل',
    'أكره',
    'أضيق',
    'أفرح',
    'أحزن',
    'أفضل',
    'لا أحب',
  ],
}

const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  shopping_inquiry: [
    /\bأشتري\s+(\w+)/gi,
    /\bعندك\s+(\w+)/gi,
    /\bبتاع\s+(\w+)/gi,
    /\bأدور\s+(\w+)/gi,
  ],
  price_negotiation: [
    /\bسعر\s+(\w+)/gi,
    /\bبكم\s+(\w+)/gi,
    /\bكم\s+السعر/gi,
  ],
  product_recommendation: [
    /\bأنسب\s+(\w+)/gi,
    /\bأفضل\s+(\w+)/gi,
    /\bأحسن\s+(\w+)/gi,
  ],
  support_request: [
    /\bمساعدة\s+في\s+(\w+)/gi,
    /\bمشكلة\s+في\s+(\w+)/gi,
    /\bخطأ\s+في\s+(\w+)/gi,
  ],
  delivery_inquiry: [
    /\bتوصيل\s+(\w+)/gi,
    /\bمتى\s+(\w+)/gi,
    /\bكم\s+الوقت/gi,
  ],
  payment_issue: [
    /\bمشكلة\s+في\s+الدفع/gi,
    /\bخطأ\s+في\s+البطاقة/gi,
  ],
  product_quality: [
    /\bجودة\s+(\w+)/gi,
    /\bسيء\s+(\w+)/gi,
    /\bممتاز\s+(\w+)/gi,
  ],
  personal_preference: [
    /\bأحب\s+(\w+)/gi,
    /\bأكره\s+(\w+)/gi,
    /\bأفضل\s+(\w+)/gi,
  ],
}

export class ArabicIntentExtractor {
  /**
   * استخراج النية من النص
   */
  static extract(text: string): IntentAnalysis {
    if (!text || text.trim().length === 0) {
      return {
        intent: 'shopping_inquiry',
        confidence: 0,
        keywords: [],
        entities: [],
        context: {},
      }
    }

    const scores: Record<IntentType, number> = {
      shopping_inquiry: 0,
      price_negotiation: 0,
      product_recommendation: 0,
      support_request: 0,
      delivery_inquiry: 0,
      payment_issue: 0,
      product_quality: 0,
      personal_preference: 0,
    }

    // حساب النقاط حسب الكلمات المفتاحية
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          scores[intent as IntentType] += 1
        }
      })
    }

    // حساب النقاط حسب الأنماط
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      patterns.forEach((pattern) => {
        const matches = text.match(pattern)
        if (matches) {
          scores[intent as IntentType] += matches.length * 2
        }
      })
    }

    // تحديد أعلى نية
    let topIntent: IntentType = 'shopping_inquiry'
    let topScore = scores.shopping_inquiry

    for (const [intent, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score
        topIntent = intent as IntentType
      }
    }

    const confidence = topScore > 0 ? Math.min(topScore / 10, 1) : 0
    const keywords = this.extractKeywords(text, topIntent)
    const entities = this.extractEntities(text)
    const context = this.extractContext(text)

    return {
      intent: topIntent,
      confidence,
      keywords,
      entities,
      context,
    }
  }

  /**
   * استخراج الكلمات المفتاحية
   */
  private static extractKeywords(text: string, intent: IntentType): string[] {
    const keywords: string[] = []
    const intentWords = INTENT_KEYWORDS[intent] || []

    intentWords.forEach((keyword) => {
      if (text.includes(keyword)) {
        keywords.push(keyword)
      }
    })

    return [...new Set(keywords)]
  }

  /**
   * استخراج الكيانات (الأشياء المذكورة)
   */
  private static extractEntities(text: string): string[] {
    const entities: string[] = []
    const words = text.split(' ')

    // البحث عن أسماء المنتجات والأماكن
    const productKeywords = [
      'جوال',
      'لابتوب',
      'كمبيوتر',
      'سماعة',
      'شاشة',
      'ساعة',
      'هاتف',
      'تلفاز',
    ]

    productKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        entities.push(keyword)
      }
    })

    return [...new Set(entities)]
  }

  /**
   * استخراج السياق الإضافي
   */
  private static extractContext(text: string): Record<string, any> {
    const context: Record<string, any> = {}

    // البحث عن الأرقام (الأسعار، الكميات)
    const numberMatches = text.match(/\d+/g)
    if (numberMatches) {
      context.numbers = numberMatches.map((n) => parseInt(n))
    }

    // البحث عن الأسئلة
    if (text.includes('?')) {
      context.isQuestion = true
    }

    // البحث عن الاستعجالية
    if (text.includes('فوراً') || text.includes('الحين') || text.includes('الآن')) {
      context.urgent = true
    }

    return context
  }

  /**
   * إعادة الصياغة المقترحة للمساعد
   */
  static suggestResponse(analysis: IntentAnalysis): string {
    const responses: Record<IntentType, string> = {
      shopping_inquiry: 'دعني أساعدك في البحث عن المنتجات المناسبة',
      price_negotiation: 'يمكنني عرض لك أفضل الأسعار والعروضات',
      product_recommendation: 'سأرشح لك أفضل الخيارات بناءً على احتياجاتك',
      support_request: 'دعني أحل المشكلة لك فوراً',
      delivery_inquiry: 'سأخبرك بأسرع وقت للتوصيل',
      payment_issue: 'سنحل مشكلة الدفع معاً',
      product_quality: 'الجودة مهمة لنا جداً، سأتحقق من ذلك',
      personal_preference: 'أفهم تفضيلاتك وسأساعدك على الاختيار الأفضل',
    }

    return responses[analysis.intent] || 'كيف يمكنني مساعدتك؟'
  }
}

export default ArabicIntentExtractor
