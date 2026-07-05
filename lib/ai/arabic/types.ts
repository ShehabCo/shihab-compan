// Arabic AI Types

export type DialectType =
  | 'yemeni'
  | 'saudi'
  | 'khaliji'
  | 'egyptian'
  | 'shami'
  | 'maghrebi'
  | 'msa'

export interface DialectAnalysis {
  dialect: DialectType
  confidence: number
  region: 'middle_east' | 'gulf' | 'egypt' | 'levant' | 'maghreb' | 'unknown'
  indicators: string[]
}

export type IntentType =
  | 'shopping_inquiry'
  | 'price_negotiation'
  | 'product_recommendation'
  | 'support_request'
  | 'delivery_inquiry'
  | 'payment_issue'
  | 'product_quality'
  | 'personal_preference'

export interface IntentAnalysis {
  intent: IntentType
  confidence: number
  keywords: string[]
  entities: string[]
  context: Record<string, any>
}

export interface ConversationContext {
  userId: string
  conversationId: string
  history: Message[]
  dialect: DialectType
  preferences: {
    language: DialectType
    currency: string
    region: string
  }
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  dialect?: DialectType
  intent?: IntentType
}

export interface ArabicAIResponse {
  message: string
  intent: IntentType
  confidence: number
  actions?: Action[]
}

export interface Action {
  type: 'search' | 'recommend' | 'purchase' | 'support'
  payload: Record<string, any>
}
