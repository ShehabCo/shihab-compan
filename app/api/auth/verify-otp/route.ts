import { type NextRequest, NextResponse } from "next/server"

// In-memory OTP storage
const otpStore: Map<string, { code: string; timestamp: number }> = new Map()

// Mock user database
const users: Map<string, { id: string; phone: string; name: string }> = new Map()

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    const storedOtp = otpStore.get(phone)

    if (!storedOtp) {
      return NextResponse.json({ error: "لم يتم طلب رمز تحقق" }, { status: 400 })
    }

    if (Date.now() > storedOtp.timestamp) {
      otpStore.delete(phone)
      return NextResponse.json({ error: "انتهت صلاحية الرمز" }, { status: 400 })
    }

    if (storedOtp.code !== otp) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 400 })
    }

    let user = Array.from(users.values()).find((u) => u.phone === phone)

    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        phone,
        name: `مستخدم ${phone.slice(-4)}`,
      }
      users.set(user.id, user)
    }

    // Clear OTP
    otpStore.delete(phone)

    // Generate simple JWT token (use jsonwebtoken in production)
    const token = Buffer.from(JSON.stringify({ userId: user.id, phone })).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    return NextResponse.json({ error: "فشل التحقق" }, { status: 500 })
  }
}
