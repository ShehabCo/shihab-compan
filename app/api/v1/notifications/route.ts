// Notifications API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import notificationService from '@/lib/notifications/notification-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const notifications = await notificationService.getNotifications(user.id, limit)

    return NextResponse.json({
      notifications,
      count: notifications.length,
    })
  } catch (error) {
    console.error('[Notifications] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    await notificationService.markAsRead(notificationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Notifications] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
