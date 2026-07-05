import { type NextRequest, NextResponse } from "next/server"

// Mock user database (in production, use Supabase)
const users: Map<string, { id: string; email: string; password: string; name: string }> = new Map()

// Mock users for testing
users.set("user1", {
  id: "user_1",
  email: "test@example.com",
  password: "password123", // In production, hash this!
  name: "محمد علي",
})

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبة" }, { status: 400 })
    }

    // Find user by email
    let user = Array.from(users.values()).find((u) => u.email === email)

    if (!user) {
      // Create new user on first login (simplified for demo)
      user = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, hash with bcrypt!
        name: email.split("@")[0],
      }
      users.set(user.id, user)
    } else if (user.password !== password) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // Generate token (in production, use JWT)
    const token = Buffer.from(JSON.stringify({ userId: user.id, email })).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "فشل تسجيل الدخول" }, { status: 500 })
  }
}
