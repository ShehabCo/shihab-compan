// Payment Processing System
// نظام معالجة الدفع

import { createClient } from '@/lib/supabase/server'

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  method: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_transfer'
  transactionId: string
  createdAt: Date
  completedAt?: Date
}

export interface Invoice {
  id: string
  orderId: string
  userId: string
  amount: number
  items: Array<{ name: string; quantity: number; price: number }>
  issuedAt: Date
  dueDate: Date
  status: 'draft' | 'sent' | 'viewed' | 'paid'
}

export class PaymentProcessor {
  private supabase = createClient()

  /**
   * معالجة الدفع
   */
  async processPayment(
    orderId: string,
    userId: string,
    amount: number,
    method: Payment['method'],
    paymentToken?: string
  ): Promise<Payment> {
    const supabase = await this.supabase

    try {
      // محاكاة معالجة الدفع (في الإنتاج، استخدم Stripe أو خدمة دفع أخرى)
      const transactionId = `txn_${Date.now()}`

      const { data: payment, error } = await supabase
        .from('payments')
        .insert([
          {
            order_id: orderId,
            user_id: userId,
            amount,
            currency: 'USD',
            status: 'processing',
            method,
            transaction_id: transactionId,
            created_at: new Date(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      // محاكاة نتيجة الدفع
      const isSuccessful = Math.random() > 0.05 // 95% نسبة نجاح

      if (isSuccessful) {
        // تحديث حالة الدفع
        const { data: updatedPayment } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date(),
          })
          .eq('id', payment.id)
          .select()
          .single()

        // تحديث حالة الطلب
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', orderId)

        // إنشاء فاتورة
        await this.createInvoice(orderId, userId, amount)

        return {
          id: updatedPayment.id,
          orderId: updatedPayment.order_id,
          userId: updatedPayment.user_id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          status: 'completed',
          method: updatedPayment.method,
          transactionId: updatedPayment.transaction_id,
          createdAt: new Date(updatedPayment.created_at),
          completedAt: new Date(updatedPayment.completed_at),
        }
      } else {
        // فشل الدفع
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', payment.id)

        throw new Error('Payment processing failed')
      }
    } catch (error) {
      console.error('[Payment] Error:', error)
      throw error
    }
  }

  /**
   * الحصول على تفاصيل الدفع
   */
  async getPayment(paymentId: string): Promise<Payment> {
    const supabase = await this.supabase

    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (!payment) throw new Error('Payment not found')

    return {
      id: payment.id,
      orderId: payment.order_id,
      userId: payment.user_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      transactionId: payment.transaction_id,
      createdAt: new Date(payment.created_at),
      completedAt: payment.completed_at ? new Date(payment.completed_at) : undefined,
    }
  }

  /**
   * استرجاع المبلغ
   */
  async refund(paymentId: string, amount?: number): Promise<void> {
    const supabase = await this.supabase

    const payment = await this.getPayment(paymentId)
    const refundAmount = amount || payment.amount

    // تسجيل المسترجع
    await supabase.from('refunds').insert([
      {
        payment_id: paymentId,
        amount: refundAmount,
        status: 'processing',
        created_at: new Date(),
      },
    ])

    // تحديث حالة الدفع
    await supabase
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', paymentId)
  }

  /**
   * إنشاء فاتورة
   */
  private async createInvoice(
    orderId: string,
    userId: string,
    amount: number
  ): Promise<Invoice> {
    const supabase = await this.supabase

    const issuedAt = new Date()
    const dueDate = new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 يوم

    const { data: invoice } = await supabase
      .from('invoices')
      .insert([
        {
          order_id: orderId,
          user_id: userId,
          amount,
          issued_at: issuedAt,
          due_date: dueDate,
          status: 'sent',
        },
      ])
      .select()
      .single()

    return {
      id: invoice.id,
      orderId: invoice.order_id,
      userId: invoice.user_id,
      amount: invoice.amount,
      items: [],
      issuedAt: new Date(invoice.issued_at),
      dueDate: new Date(invoice.due_date),
      status: 'sent',
    }
  }

  /**
   * الحصول على فواتير المستخدم
   */
  async getUserInvoices(userId: string): Promise<Invoice[]> {
    const supabase = await this.supabase

    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    return (
      invoices?.map((inv: any) => ({
        id: inv.id,
        orderId: inv.order_id,
        userId: inv.user_id,
        amount: inv.amount,
        items: [],
        issuedAt: new Date(inv.issued_at),
        dueDate: new Date(inv.due_date),
        status: inv.status,
      })) || []
    )
  }
}

export default new PaymentProcessor()
