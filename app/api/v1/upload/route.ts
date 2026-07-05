// File Upload API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import mediaManager from '@/lib/storage/media-manager'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // التحقق من حجم الملف
    if (!mediaManager.validateFileSize(file)) {
      return NextResponse.json(
        { error: 'File size exceeds limit' },
        { status: 400 }
      )
    }

    let uploadedFile
    if (file.type.startsWith('image/')) {
      uploadedFile = await mediaManager.uploadImage(user.id, file)
    } else {
      uploadedFile = await mediaManager.uploadFile(user.id, file)
    }

    return NextResponse.json(uploadedFile)
  } catch (error: any) {
    console.error('[Upload] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const files = await mediaManager.listFiles(user.id)
    return NextResponse.json({ files })
  } catch (error) {
    console.error('[Files] Error:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}
