// Recommendation Agent
// وكيل متخصص في توصيات المنتجات

import { BaseAgent, type AgentResponse, type AgentAction } from './base-agent'
import type { IntentAnalysis } from '../arabic/types'

interface RecommendationContext {
  userId: string
  purchaseHistory: any[]
  viewedProducts: any[]
  preferences: Record<string, any>
  similarUsers?: string[]
}

export class RecommendationAgent extends BaseAgent {
  private collaborativeData: Map<string, any[]> = new Map()
  private contentData: Map<string, any> = new Map()

  constructor() {
    super('RecommendationAgent')
    this.initializeData()
  }

  async execute(
    intent: IntentAnalysis,
    context: RecommendationContext
  ): Promise<AgentResponse> {
    const startTime = Date.now()

    try {
      if (intent.intent !== 'product_recommendation') {
        return this.createResponse(
          { error: 'Not a recommendation request' },
          'error',
          [],
          0
        )
      }

      const recommendations = await this.generateRecommendations(
        intent,
        context
      )
      const actions: AgentAction[] = [
        {
          type: 'recommend',
          payload: { recommendations },
        },
      ]

      const executionTime = Date.now() - startTime

      return {
        agentName: this.agentName,
        status: 'success',
        result: recommendations,
        actions,
        confidence: intent.confidence,
        executionTime,
      }
    } catch (error) {
      console.error(`[${this.agentName}] Error:`, error)
      return this.createResponse(
        { error: 'Recommendation generation failed' },
        'error',
        [],
        0
      )
    }
  }

  /**
   * توليد التوصيات باستخدام عدة طرق
   */
  private async generateRecommendations(
    intent: IntentAnalysis,
    context: RecommendationContext
  ): Promise<any> {
    // طريقة التصفية التعاونية (Collaborative Filtering)
    const collaborativeRecs = this.collaborativeFiltering(context)

    // طريقة التصفية بناءً على المحتوى (Content-Based Filtering)
    const contentRecs = this.contentBasedFiltering(
      intent.entities,
      context
    )

    // طريقة الهجين (Hybrid)
    const hybridRecs = this.hybridRecommendation(
      collaborativeRecs,
      contentRecs,
      context
    )

    return {
      message: 'إليك أفضل الخيارات بناءً على تفضيلاتك',
      recommendations: hybridRecs,
      reasoning: {
        userHistory: context.purchaseHistory.length,
        similarPatterns: context.similarUsers?.length || 0,
        confidence: 0.87,
      },
    }
  }

  /**
   * التصفية التعاونية - توصيات بناءً على مستخدمين متشابهين
   */
  private collaborativeFiltering(context: RecommendationContext): any[] {
    const recommendations = []

    // محاكاة البحث عن مستخدمين متشابهين
    const similarUsersProducts = [
      { product: 'جوال ذكي', score: 0.92 },
      { product: 'سماعة بلوتوث', score: 0.88 },
      { product: 'شاحن سريع', score: 0.85 },
    ]

    return similarUsersProducts
  }

  /**
   * التصفية بناءً على المحتوى - توصيات بناءً على الخصائص المتشابهة
   */
  private contentBasedFiltering(
    entities: string[],
    context: RecommendationContext
  ): any[] {
    const recommendations = []

    // البحث عن منتجات مع خصائص متشابهة
    if (entities.includes('جوال')) {
      recommendations.push(
        { product: 'واقي شاشة جوال', score: 0.9 },
        { product: 'كيس حماية جوال', score: 0.87 },
        { product: 'شاحن جوال سريع', score: 0.85 }
      )
    }

    if (entities.includes('لابتوب')) {
      recommendations.push(
        { product: 'حقيبة لابتوب', score: 0.91 },
        { product: 'كمبيوتر محمول إضافي', score: 0.86 },
        { product: 'مبرد لابتوب', score: 0.83 }
      )
    }

    return recommendations
  }

  /**
   * التوصيات الهجينة - دمج النتائج من طرق متعددة
   */
  private hybridRecommendation(
    collaborative: any[],
    contentBased: any[],
    context: RecommendationContext
  ): any[] {
    const combined = [...collaborative, ...contentBased]

    // دمج النتائج والتصفية حسب الدرجة
    const merged = combined.reduce((acc: any[], rec: any) => {
      const existing = acc.find((r) => r.product === rec.product)
      if (existing) {
        existing.score = (existing.score + rec.score) / 2
      } else {
        acc.push(rec)
      }
      return acc
    }, [])

    // الترتيب حسب الدرجة
    return merged.sort((a, b) => b.score - a.score).slice(0, 5)
  }

  /**
   * تهيئة البيانات
   */
  private initializeData(): void {
    // محاكاة بيانات المنتجات
    this.contentData.set('جوال', {
      category: 'electronics',
      subCategory: 'smartphones',
      features: ['camera', 'battery', 'processor'],
    })

    this.contentData.set('لابتوب', {
      category: 'electronics',
      subCategory: 'computers',
      features: ['processor', 'ram', 'storage'],
    })
  }
}

export default new RecommendationAgent()
