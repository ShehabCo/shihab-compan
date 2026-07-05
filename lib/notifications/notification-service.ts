// Notification Service
// خدمة الإشعارات والتنبيهات

import { createClient } from '@/lib/supabase/server'

export interface Notification {
  id: string
  userId: string
  type: 'order' | 'price' | 'recommendation' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export class NotificationService {
  private supabase = createClient()

  /**
   * إرسال إشعار للمستخدم
   */
  async sendNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<Notification> {
    const supabase = await this.supabase

    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          action_url: actionUrl,
          read: false,
          created_at: new Date(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      read: data.read,
      createdAt: new Date(data.created_at),
      actionUrl: data.action_url,
    }
  }

  /**
   * الحصول على إشعارات المستخدم
   */
  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    const supabase = await this.supabase

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return (
      data?.map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: new Date(n.created_at),
        actionUrl: n.action_url,
      })) || []
    )
  }

  /**
   * تحديد إشعار كمقروء
   */
  async markAsRead(notificationId: string): Promise<void> {
    const supabase = await this.supabase

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
  }

  /**
   * حذف إشعار
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const supabase = await this.supabase

    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
  }

  /**
   * إرسال إشعار عند انخفاض السعر
   */
  async notifyPriceDrop(
    userId: string,
    productName: string,
    originalPrice: number,
    newPrice: number
  ): Promise<Notification> {
    const discount = (((originalPrice - newPrice) / originalPrice) * 100).toFixed(0)

    return this.sendNotification(
      userId,
      'price',
      `تنبيه: انخفاض سعر ${productName}`,
      `السعر انخفض من $${originalPrice} إلى $${newPrice} (خصم ${discount}%)`,
      `/products/${productName}`
    )
  }

  /**
   * إرسال إشعار تأكيد الطلب
   */
  async notifyOrderConfirmation(
    userId: string,
    orderId: string,
    totalAmount: number
  ): Promise<Notification> {
    return this.sendNotification(
      userId,
      'order',
      'تم تأكيد الطلب',
      `تم استقبال طلبك #${orderId} بقيمة $${totalAmount}. سيتم شحنه قريباً.`,
      `/orders/${orderId}`
    )
  }

  /**
   * إرسال توصيات شخصية
   */
  async notifyRecommendations(
    userId: string,
    productNames: string[]
  ): Promise<Notification> {
    return this.sendNotification(
      userId,
      'recommendation',
      'توصيات مخصصة لك',
      `اكتشفنا ${productNames.length} منتجات جديدة قد تعجبك!`,
      '/recommendations'
    )
  }

  /**
   * الحصول على عدد الإشعارات غير المقروءة
   */
  async getUnreadCount(userId: string): Promise<number> {
    const supabase = await this.supabase

    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    return count || 0
  }
}

export default new NotificationService()
