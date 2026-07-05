// Pricing Agent
// وكيل متخصص في إدارة الأسعار والعروضات الديناميكية

import { BaseAgent, type AgentResponse, type AgentAction } from './base-agent'
import type { IntentAnalysis } from '../arabic/types'

interface PricingContext {
  userId: string
  productId: string
  basePrice: number
  demand: number
  inventory: number
  userSegment: 'vip' | 'regular' | 'budget'
  competitorPrices: number[]
}

interface PricingDecision {
  finalPrice: number
  discount: number
  recommendation: string
  reasoning: string
}

export class PricingAgent extends BaseAgent {
  constructor() {
    super('PricingAgent')
  }

  async execute(
    intent: IntentAnalysis,
    context: PricingContext
  ): Promise<AgentResponse> {
    const startTime = Date.now()

    try {
      if (intent.intent !== 'price_negotiation') {
        return this.createResponse(
          { error: 'Not a pricing request' },
          'error',
          [],
          0
        )
      }

      const pricingDecision = await this.calculateOptimalPrice(context)
      const actions: AgentAction[] = [
        {
          type: 'update_price',
          payload: {
            productId: context.productId,
            newPrice: pricingDecision.finalPrice,
            discount: pricingDecision.discount,
          },
        },
      ]

      const executionTime = Date.now() - startTime

      return {
        agentName: this.agentName,
        status: 'success',
        result: pricingDecision,
        actions,
        confidence: 0.92,
        executionTime,
      }
    } catch (error) {
      console.error(`[${this.agentName}] Error:`, error)
      return this.createResponse(
        { error: 'Pricing calculation failed' },
        'error',
        [],
        0
      )
    }
  }

  /**
   * حساب السعر الأمثل باستخدام عدة عوامل
   */
  private async calculateOptimalPrice(
    context: PricingContext
  ): Promise<PricingDecision> {
    // 1. تحليل الطلب والعرض
    const demandFactor = this.calculateDemandFactor(
      context.demand,
      context.inventory
    )

    // 2. تحليل الأسعار المنافسة
    const competitiveFactor = this.analyzeCompetitivePricing(
      context.basePrice,
      context.competitorPrices
    )

    // 3. تخصيص حسب فئة المستخدم
    const segmentFactor = this.calculateSegmentFactor(context.userSegment)

    // 4. حساب السعر النهائي
    const calculatedPrice = context.basePrice * demandFactor * competitiveFactor * segmentFactor

    // 5. حساب الخصم (إن وجد)
    const discount = Math.max(0, context.basePrice - calculatedPrice)
    const discountPercentage = (discount / context.basePrice) * 100

    // 6. قرار التسعير
    const decision: PricingDecision = {
      finalPrice: Math.round(calculatedPrice * 100) / 100,
      discount: Math.round(discountPercentage * 100) / 100,
      recommendation: this.generateRecommendation(
        calculatedPrice,
        context.basePrice,
        discountPercentage
      ),
      reasoning: this.generateReasoning(
        demandFactor,
        competitiveFactor,
        segmentFactor
      ),
    }

    return decision
  }

  /**
   * حساب عامل الطلب والعرض
   */
  private calculateDemandFactor(demand: number, inventory: number): number {
    const ratio = demand / (inventory || 1)

    // إذا كان الطلب عالياً والمخزون منخفضاً، رفع السعر
    if (ratio > 2) return 1.15 // زيادة 15%
    if (ratio > 1.5) return 1.08 // زيادة 8%
    if (ratio > 1) return 1.0 // لا توجد تغييرات
    if (ratio < 0.5) return 0.9 // تخفيض 10%
    return 0.95 // تخفيض 5%
  }

  /**
   * تحليل الأسعار المنافسة
   */
  private analyzeCompetitivePricing(
    basePrice: number,
    competitorPrices: number[]
  ): number {
    if (competitorPrices.length === 0) return 1.0

    const avgCompetitorPrice =
      competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length
    const difference = basePrice - avgCompetitorPrice

    // إذا كان السعر أعلى من المتوسط
    if (difference > avgCompetitorPrice * 0.1) return 0.95 // تخفيض 5%
    if (difference > avgCompetitorPrice * 0.05) return 0.98 // تخفيض 2%
    if (difference < -avgCompetitorPrice * 0.1) return 1.05 // زيادة 5%

    return 1.0
  }

  /**
   * حساب عامل فئة المستخدم
   */
  private calculateSegmentFactor(
    segment: 'vip' | 'regular' | 'budget'
  ): number {
    const factors: Record<string, number> = {
      vip: 1.0, // لا خصم للعملاء المميزين
      regular: 1.0, // السعر العادي
      budget: 0.9, // خصم 10% للعملاء الباحثين عن الميزانية
    }
    return factors[segment] || 1.0
  }

  /**
   * توليد التوصية
   */
  private generateRecommendation(
    finalPrice: number,
    basePrice: number,
    discount: number
  ): string {
    if (discount > 15) {
      return `خصم كبير متاح: ${discount.toFixed(1)}% من السعر الأصلي`
    } else if (discount > 5) {
      return `عرض خاص: توفير ${discount.toFixed(1)}% على هذا المنتج`
    } else if (discount > 0) {
      return `سعر منافس: توفير طفيفة ${discount.toFixed(1)}%`
    } else if (finalPrice > basePrice) {
      return `منتج مطلوب جداً - سعر محدث`
    }
    return `سعر منافس وعادل`
  }

  /**
   * توليد المنطق والتفسير
   */
  private generateReasoning(
    demandFactor: number,
    competitiveFactor: number,
    segmentFactor: number
  ): string {
    const reasons: string[] = []

    if (demandFactor > 1.1) {
      reasons.push('الطلب مرتفع على المنتج')
    } else if (demandFactor < 0.95) {
      reasons.push('المخزون مرتفع - خصم لتعزيز المبيعات')
    }

    if (competitiveFactor < 0.98) {
      reasons.push('أسعار تنافسية في السوق')
    }

    if (segmentFactor < 1.0) {
      reasons.push('عرض خاص لفئة العملاء')
    }

    return reasons.join(' و ')
  }
}

export default new PricingAgent()
