// Multi-Agent Orchestrator API
// ينسق عمل الوكلاء المتعددين

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withApiProtection } from '@/lib/security/api-protection'
import { RateLimiter } from '@/lib/security/rate-limiting'
import ArabicAIService from '@/lib/ai/arabic-ai-service'
import ShoppingAgent from '@/lib/ai/agents/shopping-agent'
import RecommendationAgent from '@/lib/ai/agents/recommendation-agent'
import PricingAgent from '@/lib/ai/agents/pricing-agent'

export async function POST(request: NextRequest) {
  return withApiProtection(
    request,
    async (req, auth) => {
      try {
        // Rate limiting
        const rateLimitCheck = RateLimiter.checkLimit(
          RateLimiter.createUserKey(auth.userId, 'agents_orchestration'),
          20,
          600
        )

        if (!rateLimitCheck.allowed) {
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
          )
        }

        const body = await request.json()
        const { message, conversationId, productId } = body

        if (!message) {
          return NextResponse.json(
            { success: false, error: 'Message is required' },
            { status: 400 }
          )
        }

        // Step 1: Process with Arabic AI to extract intent
        const cId = conversationId || `${auth.userId}-${Date.now()}`
        const aiResponse = await ArabicAIService.processMessage(
          auth.userId,
          cId,
          message
        )

        // Step 2: Route to appropriate agents
        const supabase = await createClient()
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', auth.userId)
          .single()

        const agentResponses: any[] = []

        // Select agents based on intent
        switch (aiResponse.intent) {
          case 'shopping_inquiry':
            const shoppingResponse = await ShoppingAgent.execute(
              { ...aiResponse, confidence: 0.9 },
              {
                userId: auth.userId,
                cart: [],
                preferences: userData?.preferences || {},
                budget: userData?.budget || undefined,
              }
            )
            agentResponses.push(shoppingResponse)
            break

          case 'product_recommendation':
            const { data: purchaseHistory } = await supabase
              .from('orders')
              .select('*')
              .eq('user_id', auth.userId)
              .limit(20)

            const recommendationResponse = await RecommendationAgent.execute(
              { ...aiResponse, confidence: 0.88 },
              {
                userId: auth.userId,
                purchaseHistory: purchaseHistory || [],
                viewedProducts: [],
                preferences: userData?.preferences || {},
              }
            )
            agentResponses.push(recommendationResponse)
            break

          case 'price_negotiation':
            if (productId) {
              const { data: product } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

              const pricingResponse = await PricingAgent.execute(
                { ...aiResponse, confidence: 0.92 },
                {
                  userId: auth.userId,
                  productId,
                  basePrice: product?.price || 100,
                  demand: Math.random() * 100,
                  inventory: product?.stock_quantity || 50,
                  userSegment:
                    userData?.tier === 'vip'
                      ? 'vip'
                      : userData?.tier === 'premium'
                        ? 'regular'
                        : 'budget',
                  competitorPrices: [
                    (product?.price || 100) * 0.95,
                    (product?.price || 100) * 1.05,
                  ],
                }
              )
              agentResponses.push(pricingResponse)
            }
            break
        }

        // Step 3: Aggregate responses
        const aggregatedResponse = {
          conversationId: cId,
          userMessage: message,
          aiAnalysis: {
            intent: aiResponse.intent,
            confidence: aiResponse.confidence,
            message: aiResponse.message,
          },
          agentResults: agentResponses,
          bestAction: agentResponses[0]?.actions?.[0],
          executionTime: Date.now(),
        }

        return NextResponse.json({
          success: true,
          data: aggregatedResponse,
        })
      } catch (error) {
        console.error('[API] Multi-agent orchestration error:', error)
        return NextResponse.json(
          { success: false, error: 'Orchestration failed' },
          { status: 500 }
        )
      }
    },
    {
      requireAuth: true,
    }
  )
}
