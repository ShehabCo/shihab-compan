// Profile API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    })
  } catch (error) {
    console.error('[Profile] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(body)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('[Profile] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 400 }
    )
  }
}
