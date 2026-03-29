import { Groq } from '@ai-sdk/groq'
import { generateText } from 'ai'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export const aiService = {
  async generateProductDescription(productName: string, category: string): Promise<string> {
    const groq = new Groq()

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Generate a professional and engaging product description for a ${category} product named "${productName}". 
      The description should be 2-3 sentences, highlight key features and benefits, and be suitable for an e-commerce marketplace.`,
      temperature: 0.7,
      maxTokens: 150,
    })

    return text
  },

  async analyzeProductTrends(): Promise<string> {
    const groq = new Groq()

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Analyze current e-commerce trends and provide insights about popular product categories and consumer preferences. 
      Keep it concise and actionable for marketplace sellers.`,
      temperature: 0.7,
      maxTokens: 200,
    })

    return text
  },

  async generateProductRecommendation(
    userPreferences: string,
    browsedProducts: string[]
  ): Promise<string> {
    const groq = new Groq()

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Based on user preferences: "${userPreferences}" and previously browsed products: ${browsedProducts.join(', ')}, 
      suggest 3 relevant products they might be interested in. Be specific and explain why each would be a good match.`,
      temperature: 0.7,
      maxTokens: 200,
    })

    return text
  },

  async chatWithAssistant(messages: ConversationMessage[]): Promise<string> {
    const groq = new Groq()

    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 500,
      system:
        'You are a helpful e-commerce assistant for a global marketplace platform. Help users find products, answer questions about orders, provide marketplace information, and offer personalized recommendations.',
    })

    return text
  },

  async generateSEOKeywords(productName: string, category: string): Promise<string[]> {
    const groq = new Groq()

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Generate 10 SEO-optimized keywords for a ${category} product named "${productName}". 
      Return only the keywords separated by commas, no other text.`,
      temperature: 0.5,
      maxTokens: 100,
    })

    return text.split(',').map((keyword) => keyword.trim())
  },

  async detectFraud(orderData: unknown): Promise<{ isFraudulent: boolean; score: number }> {
    const groq = new Groq()

    const { text } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: `Analyze this order data for potential fraud indicators: ${JSON.stringify(orderData)}. 
      Respond with a JSON object containing "isFraudulent" (boolean) and "score" (0-1).`,
      temperature: 0.5,
      maxTokens: 100,
    })

    try {
      return JSON.parse(text)
    } catch {
      return { isFraudulent: false, score: 0 }
    }
  },
}
