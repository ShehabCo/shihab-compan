'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('authToken')
    
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [router])

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('authToken')
  
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
