import { type NextRequest, NextResponse } from "next/server"

// In-memory OTP storage (replace with database in production)
const otpStore: Map<string, { code: string; timestamp: number }> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: "رقم هاتف غير صحيح" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 10-minute expiry
    otpStore.set(phone, {
      code,
      timestamp: Date.now() + 10 * 60 * 1000,
    })

    console.log(`[OTP] Verification code for ${phone}: ${code}`)

    // In production, send SMS via:
    // - Google Cloud SMS API
    // - Twilio
    // - AWS SNS
    // - Firebase Cloud Messaging
    // For now, log to console - user will see it in browser console during development

    return NextResponse.json({
      success: true,
      message: "تم إرسال رمز التحقق (تحقق من console للرمز في الوضع التطويري)",
      // In production, don't return the code!
      // This is only for development testing
      ...(process.env.NODE_ENV === "development" && { code }),
    })
  } catch (error) {
    return NextResponse.json({ error: "فشل إرسال الرمز" }, { status: 500 })
  }
}
