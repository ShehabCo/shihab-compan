// Application Logger

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [MARA] [${level.toUpperCase()}]`
    
    if (this.isDevelopment) {
      const color = colors[level]
      console.log(`${color}${prefix}${colors.reset} ${message}`, data || '')
    } else {
      // In production, send to logging service (e.g., Sentry, LogRocket)
      console.log(`${prefix} ${message}`, data || '')
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, data)
    }
  }
}

export const logger = new Logger()
