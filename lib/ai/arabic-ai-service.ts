// Arabic AI Service - الخدمة الرئيسية للذكاء الاصطناعي العربي
// يجمع جميع مكونات الذكاء الاصطناعي العربي

import { ArabicDialectDetector } from './arabic/dialect-detector'
import { ArabicIntentExtractor } from './arabic/intent-extractor'
import type {
  DialectAnalysis,
  IntentAnalysis,
  ConversationContext,
  Message,
  ArabicAIResponse,
} from './arabic/types'

export class ArabicAIService {
  private conversationContexts: Map<string, ConversationContext> = new Map()

  /**
   * معالجة الرسالة من المستخدم العربي
   */
  async processMessage(
    userId: string,
    conversationId: string,
    message: string
  ): Promise<ArabicAIResponse> {
    // اكتشاف اللهجة
    const dialectAnalysis = ArabicDialectDetector.detect(message)

    // استخراج النية
    const intentAnalysis = ArabicIntentExtractor.extract(message)

    // الحصول على السياق أو إنشاء واحد جديد
    let context = this.conversationContexts.get(conversationId)
    if (!context) {
      context = this.createContext(userId, conversationId, dialectAnalysis)
    }

    // إضافة الرسالة للسجل
    context.history.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
      dialect: dialectAnalysis.dialect,
      intent: intentAnalysis.intent,
    })

    // توليد الرد
    const response = await this.generateResponse(context, intentAnalysis, message)

    // حفظ السياق المحدّث
    this.conversationContexts.set(conversationId, context)

    return {
      message: response.message,
      intent: intentAnalysis.intent,
      confidence: intentAnalysis.confidence,
      actions: response.actions,
    }
  }

  /**
   * إنشاء سياق محادثة جديد
   */
  private createContext(
    userId: string,
    conversationId: string,
    dialect: DialectAnalysis
  ): ConversationContext {
    return {
      userId,
      conversationId,
      history: [],
      dialect: dialect.dialect,
      preferences: {
        language: dialect.dialect,
        currency: this.getCurrencyForRegion(dialect.region),
        region: dialect.region,
      },
    }
  }

  /**
   * الحصول على العملة المناسبة حسب المنطقة
   */
  private getCurrencyForRegion(
    region: string
  ): 'YER' | 'SAR' | 'AED' | 'EGP' | 'SYP' | 'MAD' {
    const currencyMap: Record<string, any> = {
      middle_east: 'YER',
      gulf: 'SAR',
      egypt: 'EGP',
      levant: 'SYP',
      maghreb: 'MAD',
    }
    return currencyMap[region] || 'USD'
  }

  /**
   * توليد الرد بناءً على النية والسياق
   */
  private async generateResponse(
    context: ConversationContext,
    intent: IntentAnalysis,
    userMessage: string
  ): Promise<{ message: string; actions: any[] }> {
    const baseResponses: Record<string, string> = {
      shopping_inquiry: this.respondToShoppingInquiry(context, intent),
      price_negotiation: this.respondToPriceNegotiation(context, intent),
      product_recommendation: this.respondToRecommendation(context, intent),
      support_request: this.respondToSupport(context, intent),
      delivery_inquiry: this.respondToDeliveryInquiry(context, intent),
      payment_issue: this.respondToPaymentIssue(context, intent),
      product_quality: this.respondToQualityInquiry(context, intent),
      personal_preference: this.respondToPreference(context, intent),
    }

    const message = baseResponses[intent.intent] || 'كيف يمكنني مساعدتك؟'

    // إنشاء الأفعال المقترحة
    const actions = this.generateActions(intent)

    return { message, actions }
  }

  /**
   * الرد على استفسارات الشراء
   */
  private respondToShoppingInquiry(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    const entities = intent.entities.join(' و ')
    const dialects: Record<string, string> = {
      yemeni: `حبيبي، شنو المنتج اللي بدّك تشتريه؟ أنا بساعدك تلقي الأحسن من ${entities || 'عندنا'}`,
      saudi: `فديت عليك، الحين أبحث لك عن الأفضل من ${entities || 'المنتجات'} اللي عندنا`,
      khaliji: `يا غالي، شنو المنتج بالضبط؟ أنا بروح أبحث لك`,
      egyptian: `ماشي يا حاج، أنا هسع أدور لك عن ${entities || 'البتاع'} اللي بتاعك`,
      shami: `شو بتاع؟ دعني أساعدك تلقي الأحسن من ${entities}`,
      maghrebi: `مزيان جداً، دعني نبحث بالّ ${entities || 'المنتجات'}} عندنا`,
      msa: `دعني أساعدك في البحث عن أفضل ${entities || 'المنتجات'}} المتاحة`,
    }

    return dialects[context.dialect] || dialects.msa
  }

  /**
   * الرد على التفاوض على الأسعار
   */
  private respondToPriceNegotiation(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    const dialects: Record<string, string> = {
      yemeni: 'عندنا أفضل الأسعار يا حبيبي، بتاعنا ما فيه أحسن وأرخص',
      saudi: 'الحمد لله على أسعارنا، ما في أرخص من كذا',
      khaliji: 'بروه، الأسعار عندنا منافسة جداً وموثوقة',
      egyptian: 'ماشي يا غالي، أنا أشوف لك أحسن سعر',
      shami: 'بهيك الأسعار أحسن ما تلقا في السوق',
      maghrebi: 'مزيان، الأسعار عندنا ممتازة ومنافسة',
      msa: 'يمكنني عرض أفضل الأسعار والعروضات المتاحة لك',
    }

    return dialects[context.dialect] || dialects.msa
  }

  /**
   * الرد على طلبات التوصيات
   */
  private respondToRecommendation(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    const dialects: Record<string, string> = {
      yemeni: 'أنسب لك اللي تحتاجه من المنتجات الأحسن والموثوقة',
      saudi: 'أفضل خيار لك هو اللي يناسب احتياجاتك وميزانيتك',
      khaliji: 'بروه، أفضل سيء بناء على احتياجاتك',
      egyptian: 'أنا بنصحك بالأفضل من بتاعنا',
      shami: 'شو بتحتاج بالضبط عشان أنصحك بالأحسن؟',
      maghrebi: 'مزيان، دعني أنصحك بالأفضل',
      msa: 'سأرشح لك أفضل الخيارات بناءً على احتياجاتك',
    }

    return dialects[context.dialect] || dialects.msa
  }

  /**
   * الرد على طلبات الدعم
   */
  private respondToSupport(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    const dialects: Record<string, string> = {
      yemeni: 'ما تضيق خاطرك، أنا هسع بحل المشكلة لك',
      saudi: 'خلاص، أنا هنا بساعدك في الحل فوراً',
      khaliji: 'يلا، دعني أحل هالمشكلة لك بسرعة',
      egyptian: 'ماشي، أنا هحل المشكلة دي معاك فوراً',
      shami: 'لا تقلق، أنا رح أحل هالمشكلة معك',
      maghrebi: 'بسلام، أنا رح نحل المشكلة بالسريع',
      msa: 'سأقوم بحل المشكلة لك فوراً',
    }

    return dialects[context.dialect] || dialects.msa
  }

  /**
   * الرد على استفسارات التوصيل
   */
  private respondToDeliveryInquiry(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    return 'التوصيل سيصل إليك في أسرع وقت ممكن مع ضمان الجودة'
  }

  /**
   * الرد على مشاكل الدفع
   */
  private respondToPaymentIssue(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    return 'سنحل مشكلة الدفع معاً بأسرع طريقة ممكنة'
  }

  /**
   * الرد على استفسارات الجودة
   */
  private respondToQualityInquiry(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    return 'الجودة هي أولويتنا، سأتحقق من جميع التفاصيل'
  }

  /**
   * الرد على التفضيلات الشخصية
   */
  private respondToPreference(
    context: ConversationContext,
    intent: IntentAnalysis
  ): string {
    return 'أفهم تفضيلاتك وسأساعدك على اختيار الأفضل'
  }

  /**
   * توليد الأفعال المقترحة
   */
  private generateActions(intent: IntentAnalysis): any[] {
    const actions: any[] = []

    switch (intent.intent) {
      case 'shopping_inquiry':
        actions.push({
          type: 'search',
          payload: { query: intent.entities.join(' ') },
        })
        break
      case 'price_negotiation':
        actions.push({
          type: 'show_prices',
          payload: { items: intent.entities },
        })
        break
      case 'product_recommendation':
        actions.push({
          type: 'recommend',
          payload: { interests: intent.entities },
        })
        break
      case 'delivery_inquiry':
        actions.push({
          type: 'check_delivery',
          payload: {},
        })
        break
    }

    return actions
  }

  /**
   * الحصول على السياق الحالي
   */
  getContext(conversationId: string): ConversationContext | undefined {
    return this.conversationContexts.get(conversationId)
  }

  /**
   * حذف السياق (عند انتهاء المحادثة)
   */
  clearContext(conversationId: string): void {
    this.conversationContexts.delete(conversationId)
  }
}

export default new ArabicAIService()
