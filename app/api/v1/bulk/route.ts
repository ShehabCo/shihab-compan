// Bulk Operations API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bulkOperations from '@/lib/operations/bulk-operations'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const history = await bulkOperations.getOperationsHistory(user.id)
    return NextResponse.json({ operations: history })
  } catch (error) {
    console.error('[Bulk Operations] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get operations history' },
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
    const { action, data } = body

    let result

    if (action === 'import') {
      result = await bulkOperations.importProducts(user.id, data)
    } else if (action === 'export') {
      const csvData = await bulkOperations.exportProducts(user.id)
      return NextResponse.json({ csv: csvData })
    } else if (action === 'price_update') {
      result = await bulkOperations.bulkUpdatePrices(user.id, data)
    } else if (action === 'delete') {
      result = await bulkOperations.bulkDelete(user.id, data)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[Bulk Operations] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Bulk operation failed' },
      { status: 400 }
    )
  }
}
