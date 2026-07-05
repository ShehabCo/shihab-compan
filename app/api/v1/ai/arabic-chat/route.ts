// Arabic AI Chat API
// يتعامل مع طلبات الدردشة بالذكاء الاصطناعي العربي

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import ArabicAIService from '@/lib/ai/arabic-ai-service'
import { withApiProtection } from '@/lib/security/api-protection'
import { RateLimiter } from '@/lib/security/rate-limiting'

export async function POST(request: NextRequest) {
  return withApiProtection(
    request,
    async (req, auth) => {
      try {
        // Rate limiting
        const rateLimitCheck = RateLimiter.checkLimit(
          RateLimiter.createUserKey(auth.userId, 'arabic_chat'),
          30, // Max 30 messages per 10 minutes
          600
        )

        if (!rateLimitCheck.allowed) {
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
          )
        }

        const body = await request.json()
        const { message, conversationId } = body

        if (!message || typeof message !== 'string') {
          return NextResponse.json(
            { success: false, error: 'Message is required' },
            { status: 400 }
          )
        }

        if (message.trim().length === 0 || message.length > 1000) {
          return NextResponse.json(
            { success: false, error: 'Invalid message length' },
            { status: 400 }
          )
        }

        // Generate unique conversation ID if not provided
        const cId = conversationId || `${auth.userId}-${Date.now()}`

        // Process message with Arabic AI
        const response = await ArabicAIService.processMessage(
          auth.userId,
          cId,
          message
        )

        // Save to database for history
        const supabase = await createClient()
        const { error: saveError } = await supabase
          .from('ai_conversations')
          .insert([
            {
              user_id: auth.userId,
              conversation_id: cId,
              user_message: message,
              ai_response: response.message,
              intent: response.intent,
              confidence: response.confidence,
              language: 'ar',
            },
          ])

        if (saveError) {
          console.error('[API] Failed to save conversation:', saveError)
        }

        return NextResponse.json({
          success: true,
          data: {
            conversationId: cId,
            ...response,
          },
        })
      } catch (error) {
        console.error('[API] Arabic chat error:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to process message' },
          { status: 500 }
        )
      }
    },
    {
      requireAuth: true,
    }
  )
}

// GET /api/v1/ai/arabic-chat/history
export async function GET(request: NextRequest) {
  return withApiProtection(
    request,
    async (req, auth) => {
      try {
        const searchParams = request.nextUrl.searchParams
        const conversationId = searchParams.get('conversationId')
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')

        const supabase = await createClient()

        let query = supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', auth.userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (conversationId) {
          query = query.eq('conversation_id', conversationId)
        }

        const { data: conversations, error } = await query

        if (error) throw error

        return NextResponse.json({
          success: true,
          data: conversations || [],
          pagination: {
            offset,
            limit,
            returned: conversations?.length || 0,
          },
        })
      } catch (error) {
        console.error('[API] Failed to fetch conversation history:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to fetch history' },
          { status: 500 }
        )
      }
    },
    {
      requireAuth: true,
    }
  )
}
