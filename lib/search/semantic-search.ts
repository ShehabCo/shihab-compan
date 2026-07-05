// Semantic Search Engine
// محرك البحث الذكي - يفهم المعنى لا الكلمات فقط

import { createClient } from '@/lib/supabase/server'

export interface SearchResult {
  id: string
  title: string
  description: string
  similarity: number
  price?: number
  category?: string
}

export interface SemanticSearchQuery {
  query: string
  limit?: number
  filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
  }
}

export class SemanticSearchEngine {
  private supabase = createClient()

  /**
   * بحث دلالي ذكي عن المنتجات
   */
  async search(searchQuery: SemanticSearchQuery): Promise<SearchResult[]> {
    const { query, limit = 10, filters } = searchQuery

    try {
      // معالجة الاستعلام باستخدام التحويل إلى كلمات مفتاحية ذكية
      const keywords = this.extractKeywords(query)
      const meaningfulTerms = this.expandTerms(keywords)

      // البحث باستخدام PostgreSQL text search
      const supabase = await this.supabase
      let searchQuery_builder = supabase
        .from('products')
        .select('id, name, description, price, category, rating')
        .textSearch('search_vector', meaningfulTerms.join(' | '))

      // تطبيق الفلاتر
      if (filters?.category) {
        searchQuery_builder = searchQuery_builder.eq('category', filters.category)
      }
      if (filters?.minPrice) {
        searchQuery_builder = searchQuery_builder.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice) {
        searchQuery_builder = searchQuery_builder.lte('price', filters.maxPrice)
      }

      const { data: results, error } = await searchQuery_builder.limit(limit)

      if (error) throw error

      // حساب التشابه وترتيب النتائج
      const rankedResults = this.rankResults(results || [], keywords)

      return rankedResults
    } catch (error) {
      console.error('[SemanticSearch] Error:', error)
      return []
    }
  }

  /**
   * استخراج الكلمات المفتاحية الذكية
   */
  private extractKeywords(query: string): string[] {
    // إزالة كلمات التوقف والحروف الخاصة
    const stopWords = ['في', 'من', 'إلى', 'هل', 'ما', 'مع', 'بـ']
    const words = query
      .split(' ')
      .filter(
        (word) =>
          word.length > 2 && !stopWords.includes(word) && word !== 'و'
      )

    return words
  }

  /**
   * توسيع الكلمات المفتاحية بمرادفات وأشكال مختلفة
   */
  private expandTerms(keywords: string[]): string[] {
    const synonyms: Record<string, string[]> = {
      جوال: ['هاتف', 'موبايل', 'smartphone'],
      لابتوب: ['كمبيوتر', 'حاسوب', 'laptop', 'notebook'],
      سماعة: ['headphone', 'earphone', 'イヤホン'],
      كاميرا: ['camera', 'تصوير'],
      شاشة: ['monitor', 'display', 'screen'],
      بطاريه: ['battery', 'طاقة'],
      سريع: ['fast', 'quick', 'speed'],
      رخيص: ['cheap', 'affordable', 'budget'],
      غالي: ['expensive', 'luxury', 'premium'],
      جود: ['quality', 'excellent', 'great'],
      تصوير_ليل: ['night', 'low-light', 'dark'],
      عزل_صوت: ['noise-cancelling', 'isolation', 'quiet'],
    }

    const expanded: Set<string> = new Set(keywords)

    keywords.forEach((keyword) => {
      if (synonyms[keyword]) {
        synonyms[keyword].forEach((synonym) => expanded.add(synonym))
      }
    })

    return Array.from(expanded)
  }

  /**
   * ترتيب النتائج حسب الملاءمة
   */
  private rankResults(
    results: any[],
    keywords: string[]
  ): SearchResult[] {
    const ranked = results.map((result) => {
      let similarity = 0

      // حساب التشابه بناءً على تطابق الكلمات المفتاحية
      keywords.forEach((keyword) => {
        if (
          result.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          result.description?.toLowerCase().includes(keyword.toLowerCase())
        ) {
          similarity += 0.5
        }
      })

      // زيادة التشابه بناءً على التقييم
      if (result.rating) {
        similarity += (result.rating / 5) * 0.3
      }

      return {
        id: result.id,
        title: result.name,
        description: result.description,
        similarity: Math.min(similarity, 1),
        price: result.price,
        category: result.category,
      }
    })

    return ranked.sort((a, b) => b.similarity - a.similarity)
  }

  /**
   * البحث عن منتجات متشابهة
   */
  async findSimilarProducts(productId: string, limit: number = 5) {
    const supabase = await this.supabase

    // الحصول على المنتج الأصلي
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (!product) return []

    // البحث عن منتجات في نفس الفئة
    const { data: similarProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', productId)
      .limit(limit)

    return similarProducts || []
  }

  /**
   * اقتراحات البحث التلقائية
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return []

    const supabase = await this.supabase
    const { data: suggestions } = await supabase
      .from('product_keywords')
      .select('keyword')
      .ilike('keyword', `${query}%`)
      .limit(10)

    return suggestions?.map((s) => s.keyword) || []
  }
}

export default new SemanticSearchEngine()
