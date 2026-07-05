// Arabic Dialect Detection Engine
// يكتشف اللهجات العربية الستة: يمني، سعودي، خليجي، مصري، شامي، مغربي

import type { DialectType, DialectAnalysis } from './types'

const DIALECT_PATTERNS: Record<DialectType, RegExp[]> = {
  yemeni: [
    /\bشنو\b/gi, // "شنو" - ماذا
    /\bحبيبي\b/gi, // تودد
    /\bثاني\b/gi, // جديد
    /\bشرقاوي\b/gi, // من الشرق
    /\bول\b/gi, // أول
    /\bيت\b/gi, // بيت
  ],
  saudi: [
    /\bأبو\b/gi, // تحبب
    /\bالحين\b/gi, // الآن
    /\bفديت\b/gi, // أضحي بنفسي
    /\bخلاص\b/gi, // حسن
    /\bولا\b/gi, // أو
    /\bأنقع\b/gi, // أتراجع
  ],
  khaliji: [
    /\bشنو\b/gi,
    /\bبروه\b/gi, // بالفعل
    /\bفلوس\b/gi, // مال
    /\bحتى\b/gi, // إلى
    /\bيلا\b/gi, // هيا
    /\bماي\b/gi, // لا (نفي)
  ],
  egyptian: [
    /\bأيوه\b/gi, // نعم
    /\bبتاع\b/gi, // شيء
    /\bشنطة\b/gi, // حقيبة
    /\bماشي\b/gi, // حسن
    /\bالمفروض\b/gi, // يجب
    /\bأنا\b/gi, // (استخدام خاص)
  ],
  shami: [
    /\bشو\b/gi, // ماذا
    /\bبهيك\b/gi, // بهذا
    /\bولك\b/gi, // (حرف نداء)
    /\bيلا\b/gi,
    /\bأسرع\b/gi,
    /\bفي\b/gi, // (استخدام خاص)
  ],
  maghrebi: [
    /\bشنو\b/gi,
    /\bبال\b/gi, // في
    /\bولاد\b/gi, // أطفال
    /\bمزيان\b/gi, // جيد
    /\bرّاه\b/gi, // إنه
    /\bبسلام\b/gi, // وداعاً
  ],
}

const SLANG_MAPPINGS: Record<string, string> = {
  // يمني
  شنو: 'ما هو',
  'حبيبي': 'يا عزيزي',
  ثاني: 'جديد',

  // سعودي
  'الحين': 'الآن',
  'فديت': 'أضحي بنفسي',
  خلاص: 'حسن',

  // خليجي
  'بروه': 'بالفعل',
  'فلوس': 'مال',

  // مصري
  'أيوه': 'نعم',
  'بتاع': 'شيء',
  'ماشي': 'حسن',

  // شامي
  'شو': 'ما',
  'بهيك': 'بهذا',

  // مغربي
  'مزيان': 'جيد',
}

const CULTURAL_INDICATORS = {
  shopping: ['أشتري', 'أشترى', 'بتاع', 'منتج', 'سعر', 'دفع'],
  greetings: ['السلام عليكم', 'مرحبا', 'صباح الخير', 'مساء الخير'],
  emotions: ['أحب', 'أحمل', 'أشعر', 'أضيق', 'أفرح'],
  time: ['الآن', 'الحين', 'غدا', 'أمس', 'بكرا'],
}

export class ArabicDialectDetector {
  /**
   * يكتشف اللهجة العربية للنص
   */
  static detect(text: string): DialectAnalysis {
    if (!text || text.trim().length === 0) {
      return {
        dialect: 'msa', // Modern Standard Arabic
        confidence: 0,
        region: 'unknown',
        indicators: [],
      }
    }

    const scores: Record<DialectType, number> = {
      yemeni: 0,
      saudi: 0,
      khaliji: 0,
      egyptian: 0,
      shami: 0,
      maghrebi: 0,
    }

    // حساب النقاط للهجات
    for (const [dialect, patterns] of Object.entries(DIALECT_PATTERNS)) {
      patterns.forEach((pattern) => {
        const matches = text.match(pattern)
        if (matches) {
          scores[dialect as DialectType] += matches.length
        }
      })
    }

    // تحديد أعلى لهجة
    let topDialect: DialectType = 'yemeni'
    let topScore = scores.yemeni

    for (const [dialect, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score
        topDialect = dialect as DialectType
      }
    }

    const confidence = topScore / (text.split(' ').length || 1)
    const region = this.getRegion(topDialect)
    const indicators = this.extractIndicators(text, topDialect)

    return {
      dialect: topDialect,
      confidence: Math.min(confidence, 1),
      region,
      indicators,
    }
  }

  /**
   * معايرة اللهجة إلى اللغة العربية الفصحى
   */
  static normalize(text: string): string {
    let normalized = text

    for (const [slang, formal] of Object.entries(SLANG_MAPPINGS)) {
      const regex = new RegExp(`\\b${slang}\\b`, 'gi')
      normalized = normalized.replace(regex, formal)
    }

    return normalized
  }

  /**
   * الحصول على المنطقة الجغرافية
   */
  private static getRegion(
    dialect: DialectType
  ): 'middle_east' | 'gulf' | 'egypt' | 'levant' | 'maghreb' | 'unknown' {
    const regionMap: Record<DialectType, any> = {
      yemeni: 'middle_east',
      saudi: 'gulf',
      khaliji: 'gulf',
      egyptian: 'egypt',
      shami: 'levant',
      maghrebi: 'maghreb',
    }
    return regionMap[dialect]
  }

  /**
   * استخراج مؤشرات اللهجة والمحتوى
   */
  private static extractIndicators(text: string, dialect: DialectType): string[] {
    const indicators: string[] = []

    // إضافة اللهجة
    indicators.push(`dialect:${dialect}`)

    // الكشف عن المؤشرات الثقافية
    for (const [category, words] of Object.entries(CULTURAL_INDICATORS)) {
      if (words.some((word) => text.includes(word))) {
        indicators.push(`context:${category}`)
      }
    }

    return indicators
  }

  /**
   * التحليل العميق للنص
   */
  static deepAnalyze(text: string) {
    const detection = this.detect(text)
    const normalized = this.normalize(text)

    return {
      ...detection,
      normalized,
      wordCount: text.split(' ').length,
      hasPunctuation: /[!?.]/.test(text),
    }
  }
}

export default ArabicDialectDetector
