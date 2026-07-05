"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ServiceFormProps {
  userId: string
  service?: {
    id: string
    title: string
    description: string
    category: string
    price: number
    delivery_days: number
    status: string
    image_url?: string
  }
}

const categories = [
  { value: "design", label: "تصميم" },
  { value: "development", label: "برمجة" },
  { value: "writing", label: "كتابة" },
  { value: "marketing", label: "تسويق" },
  { value: "video", label: "فيديو" },
  { value: "music", label: "موسيقى" },
  { value: "business", label: "أعمال" },
  { value: "other", label: "أخرى" },
]

const statuses = [
  { value: "draft", label: "مسودة" },
  { value: "active", label: "نشط" },
  { value: "paused", label: "متوقف" },
]

export function ServiceForm({ userId, service }: ServiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    category: service?.category || "design",
    price: service?.price || 0,
    delivery_days: service?.delivery_days || 1,
    status: service?.status || "draft",
    image_url: service?.image_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (service) {
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: formData.price,
            delivery_days: formData.delivery_days,
            status: formData.status,
            image_url: formData.image_url || null,
          })
          .eq("id", service.id)
          .eq("seller_id", userId)

        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase.from("services").insert({
          seller_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          delivery_days: formData.delivery_days,
          status: formData.status,
          image_url: formData.image_url || null,
        })

        if (error) throw error
      }

      router.push("/seller/services")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الخدمة</CardTitle>
          <CardDescription>أدخل معلومات خدمتك بشكل واضح ومفصل</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الخدمة *</Label>
            <Input
              id="title"
              placeholder="مثال: تصميم شعار احترافي"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الخدمة *</Label>
            <Textarea
              id="description"
              placeholder="اشرح تفاصيل خدمتك وما ستقدمه للعميل..."
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">الفئة *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الحالة *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">السعر (بالدولار) *</Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="0.01"
                placeholder="50"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_days">مدة التسليم (بالأيام) *</Label>
              <Input
                id="delivery_days"
                type="number"
                min="1"
                placeholder="3"
                required
                value={formData.delivery_days}
                onChange={(e) => setFormData({ ...formData, delivery_days: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">رابط الصورة (اختياري)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">أدخل رابط صورة لخدمتك (يفضل 16:9)</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {service ? "حفظ التعديلات" : "إضافة الخدمة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
