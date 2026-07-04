import { NextRequest, NextResponse } from 'next/server'

interface VerifyRequest {
  email?: string
  phone?: string
  otp: string
  type: 'email' | 'phone'
}

// Store OTPs temporarily (in production, use database/Redis)
const otpStore = new Map<string, { code: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json()
    const { email, phone, otp, type } = body

    if (!otp) {
      return NextResponse.json(
        { error: 'رمز التحقق مطلوب' },
        { status: 400 }
      )
    }

    const identifier = type === 'email' ? email : phone

    // In production, verify OTP from database/Redis
    // For now, accept any 6-digit OTP (development mode)
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'رمز التحقق يجب أن يكون 6 أرقام' },
        { status: 400 }
      )
    }

    // Generate session token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json(
      {
        success: true,
        message: 'تم التحقق بنجاح',
        token,
        user: {
          [type === 'email' ? 'email' : 'phone']: identifier,
          type,
          createdAt: new Date().toISOString()
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في التحقق' },
      { status: 500 }
    )
  }
}
