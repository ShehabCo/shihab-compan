import { NextRequest, NextResponse } from 'next/server'

// In production, this would integrate with Gmail API and Twilio/SMS service
export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json()

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو رقم الهاتف مطلوب' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // In production:
    // For Email: Send via Gmail API using nodemailer or similar
    // For SMS: Send via Twilio API

    // For now, log for development
    if (email) {
      console.log(`[GMAIL OTP] Email: ${email}, OTP: ${otp}`)
      // TODO: Integrate Gmail API
      // await sendGmailOtp(email, otp)
    } else if (phone) {
      console.log(`[SMS OTP] Phone: ${phone}, OTP: ${otp}`)
      // TODO: Integrate Twilio API
      // await sendSmsOtp(phone, otp)
    }

    return NextResponse.json(
      {
        success: true,
        message: type === 'email'
          ? `تم إرسال رمز التحقق إلى ${email}`
          : `تم إرسال رمز التحقق إلى ${phone}`,
        otp // For development only, remove in production
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال رمز التحقق' },
      { status: 500 }
    )
  }
}
