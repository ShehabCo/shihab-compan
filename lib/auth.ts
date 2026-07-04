// Authentication utilities

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function setAuth(token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    sessionStorage.clear()
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
