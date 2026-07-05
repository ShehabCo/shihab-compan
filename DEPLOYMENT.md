# دليل النشر - Shahab Platform

## نشر المشروع على Vercel

### الخطوة 1: ربط المشروع بـ GitHub

1. اضغط على زر "Push to GitHub" في أعلى يمين الشاشة
2. اختر اسم المستودع: `shahab-marketplace`
3. اختر الخصوصية: Private أو Public
4. اضغط "Create Repository"

### الخطوة 2: النشر على Vercel

1. اضغط على زر "Publish" في أعلى يمين الشاشة
2. سيتم نشر المشروع تلقائياً على Vercel
3. ستحصل على رابط مباشر للمنصة

### الخطوة 3: إعداد قاعدة البيانات

1. افتح لوحة تحكم Supabase من قسم "Connect" في الشريط الجانبي
2. شغّل السكريبتات SQL بالترتيب:
   - `scripts/001_create_users_and_profiles.sql`
   - `scripts/002_create_services.sql`
   - `scripts/003_create_orders.sql`
   - `scripts/004_create_wallet.sql`
   - `scripts/005_create_reviews.sql`
   - `scripts/006_create_messages.sql`
   - `scripts/007_wallet_functions.sql`

### الخطوة 4: إضافة بيانات تجريبية (اختياري)

يمكنك إضافة بيانات تجريبية للاختبار:

```sql
-- إضافة مستخدم بائع تجريبي
INSERT INTO profiles (id, email, full_name, display_name, role, bio)
VALUES (
  'user-id-here',
  'seller@example.com',
  'محمد أحمد',
  'محمد المصمم',
  'seller',
  'مصمم جرافيك محترف مع خبرة 5 سنوات'
);

-- إضافة خدمة تجريبية
INSERT INTO services (seller_id, title, description, category, price, delivery_days, status)
VALUES (
  'user-id-here',
  'تصميم شعار احترافي',
  'سأقوم بتصميم شعار احترافي لعلامتك التجارية',
  'design',
  50.00,
  3,
  'active'
);
```

## إعداد النطاق المخصص

1. اذهب إلى إعدادات المشروع في Vercel
2. اختر "Domains"
3. أضف نطاقك المخصص (مثل: shahab.com)
4. اتبع التعليمات لتحديث سجلات DNS

## متغيرات البيئة

جميع متغيرات البيئة الخاصة بـ Supabase متوفرة تلقائياً:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## المراقبة والصيانة

### مراقبة الأداء
- استخدم Vercel Analytics لمتابعة الأداء
- راقب استخدام قاعدة البيانات في Supabase

### النسخ الاحتياطي
- Supabase يقوم بنسخ احتياطي تلقائي يومي
- يمكنك تصدير البيانات يدوياً من لوحة تحكم Supabase

### التحديثات
- استخدم GitHub للتحكم في الإصدارات
- Vercel ينشر التحديثات تلقائياً عند الدفع إلى main

## الأمان

### SSL/TLS
- Vercel يوفر شهادة SSL تلقائياً
- جميع الاتصالات مشفرة

### حماية البيانات
- Row Level Security مفعل على جميع الجداول
- التحقق من الصلاحيات على مستوى الخادم

## الدعم الفني

للمساعدة:
- وثائق Vercel: https://vercel.com/docs
- وثائق Supabase: https://supabase.com/docs
- دعم v0: vercel.com/help

---

تم بنجاح! منصة شهاب جاهزة للإطلاق 🚀
