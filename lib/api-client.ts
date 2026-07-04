import { logger } from './logger'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      logger.debug(`API Request: ${options?.method || 'GET'} ${endpoint}`)

      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        logger.error(`API Error: ${response.status}`, data)
        return {
          success: false,
          error: data.error || 'حدث خطأ ما',
        }
      }

      logger.debug(`API Success: ${endpoint}`)
      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      logger.error('API Request Failed', error)
      return {
        success: false,
        error: 'فشل الاتصال بالخادم',
      }
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
