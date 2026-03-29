import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "مرة أم سليم | Mara Umm Salim - مطعم عربي فاخر",
  description: "مرة أم سليم - أفخم المطاعم العربية. وجبات تقليدية أصيلة مع توصيل سريع وآمن",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
