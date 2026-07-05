"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

const categories = [
  { value: "all", label: "الكل" },
  { value: "design", label: "تصميم" },
  { value: "development", label: "برمجة" },
  { value: "writing", label: "كتابة" },
  { value: "marketing", label: "تسويق" },
  { value: "video", label: "فيديو" },
  { value: "music", label: "موسيقى" },
  { value: "business", label: "أعمال" },
  { value: "other", label: "أخرى" },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={currentCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category.value)}
          className={cn(
            "whitespace-nowrap",
            currentCategory === category.value && "bg-primary text-primary-foreground",
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
