// Analytics API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import userAnalyticsService from '@/lib/analytics/user-analytics'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const analytics = await userAnalyticsService.getUserAnalytics(user.id)
    const journey = await userAnalyticsService.trackUserJourney(user.id, 20)
    const conversion = await userAnalyticsService.getConversionAnalytics()

    return NextResponse.json({
      userAnalytics: analytics,
      userJourney: journey,
      platformConversion: conversion,
    })
  } catch (error) {
    console.error('[Analytics] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventType, productId, metadata } = body

    await userAnalyticsService.logEvent(user.id, eventType, productId, metadata)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics] Error:', error)
    return NextResponse.json(
      { error: 'Failed to log event' },
      { status: 500 }
    )
  }
}
