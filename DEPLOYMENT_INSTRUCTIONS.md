# دليل نشر منصة شهاب | Shahab Platform Deployment Guide

## الطريقة الأولى: النشر عبر واجهة Vercel (الأسهل)

### الخطوات:

1. **انقر على زر "Publish"** في الزاوية العلوية اليمنى من v0
2. **اختر "Deploy to Vercel"**
3. **قم بتسجيل الدخول** إلى حساب Vercel الخاص بك
4. **اختر اسم المشروع**: shahab-marketplace (أو أي اسم تفضله)
5. **انقر Deploy** - سيقوم Vercel بالنشر تلقائياً

✅ **سيتم تزويدك برابط مباشر للمنصة خلال دقائق**

---

## الطريقة الثانية: النشر عبر GitHub + Vercel (للمطورين)

### 1. رفع الكود إلى GitHub

```bash
# إنشاء مستودع جديد على GitHub أولاً، ثم:
git init
git add .
git commit -m "Initial commit: Shahab marketplace platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shahab-marketplace.git
git push -u origin main
```

### 2. ربط المستودع بـ Vercel

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. انقر **Import Git Repository**
3. اختر مستودع **shahab-marketplace**
4. انقر **Import**
5. أضف المتغيرات البيئية (Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
6. انقر **Deploy**

---

## الطريقة الثالثة: النشر عبر Vercel CLI (للمطورين المتقدمين)

### 1. تثبيت Vercel CLI

```bash
npm install -g vercel
```

### 2. تسجيل الدخول

```bash
vercel login
```

### 3. تحديث الكود من المستودع (إذا كنت تعمل مع Git)

```bash
git checkout main
git pull origin main
```

### 4. تثبيت الحزم وبناء المشروع

```bash
npm install
npm run build
```

### 5. النشر إلى الإنتاج

```bash
vercel --prod
```

أو يمكنك استخدام:

```bash
vercel deploy --prod
```

---

## بعد النشر: إعداد قاعدة البيانات

### 1. الذهاب إلى Supabase Dashboard

اذهب إلى [database.new](https://database.new) أو افتح مشروعك الحالي

### 2. تشغيل سكريبتات SQL

في **SQL Editor**، قم بتشغيل السكريبتات التالية بالترتيب:

```
1. scripts/001_create_users_and_profiles.sql
2. scripts/002_create_services.sql
3. scripts/003_create_orders.sql
4. scripts/004_create_wallet.sql
5. scripts/005_create_reviews.sql
6. scripts/006_create_messages.sql
7. scripts/007_seed_data.sql (بيانات تجريبية اختيارية)
```

### 3. التحقق من الجداول

تأكد من إنشاء جميع الجداول:
- profiles
- services
- orders
- wallets
- transactions
- reviews
- messages
- conversations

---

## إعداد المتغيرات البيئية في Vercel

### عبر واجهة Vercel:

1. اذهب إلى **Project Settings** > **Environment Variables**
2. أضف المتغيرات التالية:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### عبر Vercel CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
```

---

## التحقق من النشر

### 1. زيارة الموقع

```
https://shahab-marketplace.vercel.app
```

### 2. اختبار المميزات الأساسية

✅ تحميل الصفحة الرئيسية بنجاح  
✅ عرض الخدمات (أو رسالة "لا توجد خدمات")  
✅ فتح صفحة تسجيل الدخول  
✅ فتح صفحة التسجيل  
✅ التأكد من اتجاه RTL صحيح  

### 3. إنشاء حساب تجريبي

1. اذهب إلى **/auth/signup**
2. سجل حساب بائع جديد
3. أنشئ خدمة تجريبية
4. تحقق من ظهورها في الصفحة الرئيسية

---

## استكشاف الأخطاء

### الموقع لا يحمل

- تحقق من **Build Logs** في Vercel
- تأكد من تثبيت جميع الحزم بشكل صحيح
- تحقق من عدم وجود أخطاء في السكريبتات

### الاتصال بقاعدة البيانات لا يعمل

- تحقق من صحة `NEXT_PUBLIC_SUPABASE_URL`
- تحقق من صحة `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- تأكد من تشغيل سكريبتات SQL بالكامل
- تحقق من RLS Policies في Supabase

### التسجيل لا يعمل

- تحقق من إعدادات Authentication في Supabase
- تأكد من تفعيل Email Provider في Supabase
- تحقق من Redirect URLs في Supabase

---

## النشر المستمر (Continuous Deployment)

عند ربط Vercel بـ GitHub، سيتم النشر التلقائي عند:

```bash
git add .
git commit -m "تحديث المنصة"
git push origin main
```

✅ **Vercel سيقوم بالنشر تلقائياً خلال دقائق**

---

## معلومات الاتصال

**المالك**: Shahab Wadah  
**البريد الإلكتروني**: mmzz770999184@gmail.com  
**الهاتف**: +967730781431 | +967781178250  
**انستغرام**: @shahab_wadah | @_yvqf

---

## روابط مفيدة

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

**تم إنشاء هذا الدليل لمنصة شهاب | Created for Shahab Marketplace Platform**
