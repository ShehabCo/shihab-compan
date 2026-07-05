// Base Agent Class
// القاعدة الأساسية لجميع الوكلاء الذكيين

import type { IntentAnalysis } from '../arabic/types'

export interface AgentAction {
  type: string
  payload: Record<string, any>
}

export interface AgentResponse {
  agentName: string
  status: 'success' | 'error'
  result: any
  actions?: AgentAction[]
  confidence: number
  executionTime: number
}

export abstract class BaseAgent {
  protected agentName: string

  constructor(agentName: string) {
    this.agentName = agentName
  }

  /**
   * تنفيذ الوكيل
   */
  abstract execute(
    intent: IntentAnalysis,
    context: any
  ): Promise<AgentResponse>

  /**
   * التحقق من صحة الإدخال
   */
  protected validateInput(intent: IntentAnalysis): boolean {
    return !!(intent && intent.intent && intent.confidence > 0.3)
  }

  /**
   * إنشاء رد نموذجي
   */
  protected createResponse(
    result: any,
    status: 'success' | 'error' = 'success',
    actions: AgentAction[] = [],
    confidence: number = 0.8
  ): AgentResponse {
    return {
      agentName: this.agentName,
      status,
      result,
      actions,
      confidence,
      executionTime: Date.now(),
    }
  }
}
