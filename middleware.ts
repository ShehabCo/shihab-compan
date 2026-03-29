import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow all requests for now
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
