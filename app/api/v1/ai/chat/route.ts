import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'

// POST /api/v1/ai/chat - AI chat endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await request.json()
    const { message, conversation_id } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get conversation context
    let conversationContext = []
    if (conversation_id) {
      const { data: messages } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true })
        .limit(10)

      conversationContext = messages || []
    }

    // Build system prompt for marketplace assistant
    const systemPrompt = `You are an expert AI shopping assistant for SuperPlatform marketplace. 
Your responsibilities:
1. Help users find products by category, price, or features
2. Answer questions about products, sellers, and ordering
3. Recommend products based on user preferences
4. Assist with account, payment, and delivery questions
5. Be helpful, friendly, and professional

Always respond in the user's language. Keep responses concise and actionable.`

    // Build message history
    const messages = [
      ...conversationContext.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    // Call Groq API using AI SDK
    const { text: assistantMessage } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      system: systemPrompt,
      messages: messages as any,
      temperature: 0.7,
      maxTokens: 1024,
    })

    // Save conversation to database
    if (user) {
      const newConversationId = conversation_id || crypto.randomUUID()

      await supabase.from('ai_conversations').insert([
        {
          conversation_id: newConversationId,
          user_id: user.id,
          role: 'user',
          content: message,
        },
        {
          conversation_id: newConversationId,
          user_id: user.id,
          role: 'assistant',
          content: assistantMessage,
        },
      ])

      return NextResponse.json({
        success: true,
        data: {
          conversation_id: newConversationId,
          message: assistantMessage,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
      },
    })
  } catch (error) {
    console.error('[API] AI chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
