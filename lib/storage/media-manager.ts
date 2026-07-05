// Media Manager
// نظام إدارة الملفات والوسائط

import { createClient } from '@supabase/supabase-js'

export interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png'
  quality?: number
}

export class MediaManager {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  /**
   * رفع ملف إلى Supabase Storage
   */
  async uploadFile(
    userId: string,
    file: File,
    bucketName: string = 'user-uploads'
  ): Promise<MediaFile> {
    try {
      // إنشاء اسم فريد للملف
      const timestamp = Date.now()
      const fileName = `${userId}/${timestamp}-${file.name}`

      // رفع الملف
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        })

      if (error) throw error

      // الحصول على URL العام
      const { data: urlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

      return {
        id: data.path,
        name: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        uploadedAt: new Date(),
      }
    } catch (error) {
      console.error('[MediaManager] Upload error:', error)
      throw error
    }
  }

  /**
   * رفع صورة مع التحسين التلقائي
   */
  async uploadImage(
    userId: string,
    file: File,
    options?: ImageOptimizationOptions
  ): Promise<MediaFile> {
    // التحقق من أن الملف صورة
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // تحسين الصورة
    const optimized = await this.optimizeImage(file, options || {})

    // رفع الصورة المحسنة
    return this.uploadFile(userId, optimized, 'product-images')
  }

  /**
   * تحسين الصورة
   */
  private async optimizeImage(
    file: File,
    options: ImageOptimizationOptions
  ): Promise<File> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Cannot get canvas context')

    const img = new Image()
    img.src = URL.createObjectURL(file)

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const { width = 800, height = 600, quality = 0.8 } = options

    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Failed to optimize image')
          const optimizedFile = new File([blob], file.name, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(optimizedFile)
        },
        'image/webp',
        quality
      )
    })
  }

  /**
   * حذف ملف
   */
  async deleteFile(
    filePath: string,
    bucketName: string = 'user-uploads'
  ): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) throw error
  }

  /**
   * الحصول على URL موقع للملف (URL محدود الوقت)
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600,
    bucketName: string = 'user-uploads'
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn)

    if (error) throw error
    return data.signedUrl
  }

  /**
   * تحميل ملف
   */
  async downloadFile(
    filePath: string,
    bucketName: string = 'user-uploads'
  ): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .download(filePath)

    if (error) throw error
    return data
  }

  /**
   * إدراج حد أقصى لحجم الملف
   */
  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxBytes
  }

  /**
   * قائمة الملفات في دلو معين
   */
  async listFiles(
    userId: string,
    bucketName: string = 'user-uploads'
  ): Promise<MediaFile[]> {
    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .list(`${userId}/`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) throw error

    return (
      data?.map((file) => ({
        id: file.name,
        name: file.name,
        type: file.metadata?.mimetype || 'unknown',
        size: file.metadata?.size || 0,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${userId}/${file.name}`,
        uploadedAt: new Date(file.created_at),
      })) || []
    )
  }
}

export default new MediaManager()
