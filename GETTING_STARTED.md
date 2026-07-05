# 🚀 Getting Started - البدء السريع

دليل سريع للبدء مع Super App Platform

## ⚡ البدء في 5 دقائق

### 1️⃣ المتطلبات (Requirements)
- Node.js 18+ ([تحميل](https://nodejs.org))
- Git ([تحميل](https://git-scm.com))
- حساب Supabase مجاني ([إنشاء](https://supabase.com))

### 2️⃣ النسخ والتثبيت

```bash
# استنساخ المستودع
git clone https://github.com/your-org/super-app.git
cd super-app

# تثبيت المكتبات
npm install
```

### 3️⃣ إعداد البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env.local

# ملء المتغيرات في .env.local
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# STRIPE_SECRET_KEY=
# إلخ...
```

### 4️⃣ تشغيل المشروع

```bash
# بدء خادم التطوير
npm run dev

# الآن افتح المتصفح:
# http://localhost:3000
```

### 5️⃣ الوصول للصفحات الرئيسية
- 🏠 الرئيسية: http://localhost:3000
- 🛒 السوق: http://localhost:3000/marketplace
- 👤 لوحة البائع: http://localhost:3000/seller-dashboard
- 🔧 لوحة الإدارة: http://localhost:3000/admin

---

## 📋 المتطلبات التفصيلية

### ✅ Supabase Setup

1. انتقل إلى https://supabase.com
2. أنشئ حساب جديد (مجاني)
3. أنشئ مشروع جديد
4. اذهب إلى **Settings → API** واحصل على:
   - `URL`
   - `ANON_KEY`
   - `SERVICE_ROLE_KEY`
5. أضفها إلى `.env.local`

### ✅ Stripe Setup (اختياري)

1. انتقل إلى https://stripe.com
2. أنشئ حساب Stripe (مجاني للاختبار)
3. اذهب إلى **Developers → API keys** واحصل على:
   - `Publishable Key`
   - `Secret Key`
4. أضفها إلى `.env.local`

### ✅ OpenAI Setup (للـ AI)

1. انتقل إلى https://platform.openai.com
2. أنشئ API Key
3. أضفه إلى `.env.local`

---

## 🧪 اختبار التطبيق

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات مع مراقبة التغييرات
npm run test:watch

# فحص الأخطاء
npm run lint

# فحص الأنواع
npm run type-check
```

---

## 📦 بناء للإنتاج

```bash
# بناء التطبيق
npm run build

# اختبار البناء محلياً
npm start
```

---

## 🐳 استخدام Docker

```bash
# بناء صورة Docker
docker build -t super-app .

# تشغيل الحاوية
docker run -p 3000:3000 super-app

# أو استخدام docker-compose
docker-compose up
```

---

## 🚀 النشر على Vercel

### الطريقة السهلة: Push إلى GitHub

1. أنشئ مستودع GitHub جديد
2. Push الكود
3. انتقل إلى https://vercel.com
4. اختر "New Project"
5. اختر المستودع الخاص بك
6. Vercel سينشر تلقائياً!

### الطريقة اليدوية: Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

---

## 🔍 استكشاف المشروع

### الملفات الرئيسية
```
app/
├── page.tsx           # الصفحة الرئيسية
├── layout.tsx         # التخطيط الأساسي
├── globals.css        # الأنماط العامة
└── api/v1/           # جميع API endpoints

lib/
├── ai/               # خدمات الذكاء الاصطناعي
├── payments/         # معالجة الدفع
└── security/         # أدوات الأمان

components/          # المكونات المعاد استخدامها
```

### الأوامر المهمة
```bash
npm run dev          # تشغيل التطوير
npm run build        # بناء للإنتاج
npm run start        # تشغيل الإنتاج
npm test             # اختبار
npm run lint         # فحص الأخطاء
```

---

## 🆘 استكشاف الأخطاء

### المشكلة: خطأ "Cannot find module"
**الحل**: `rm -rf node_modules package-lock.json && npm install`

### المشكلة: المتغيرات البيئية غير محملة
**الحل**: تأكد من إعادة تسمية `.env.local` وإعادة تشغيل `npm run dev`

### المشكلة: خطأ قاعدة البيانات
**الحل**: تحقق من URL و API Key من Supabase

### المشكلة: الدردشة الذكية لا تعمل
**الحل**: تحقق من OpenAI API Key

---

## 📚 المراجع

- [مستندات المشروع](./README.md)
- [مستندات API](./API_DOCUMENTATION.md)
- [دليل النشر](./DEPLOYMENT_CHECKLIST.md)
- [خطة الإطلاق](./LAUNCH_ROADMAP.md)

---

## 🤝 الحصول على المساعدة

### التوثيق
- 📖 [اقرأ الـ README](./README.md)
- 📚 [اقرأ مستندات الـ API](./API_DOCUMENTATION.md)

### المنتديات والدعم
- 🐛 [الإبلاغ عن الأخطاء](https://github.com/issues)
- 💬 [طلب المساعدة](https://github.com/discussions)

### التواصل المباشر
- 📧 Email: mmzz770999184@gmail.com
- 📱 Phone: +967781178250

---

## ✨ الخطوات التالية

بعد البدء، يمكنك:
1. ✅ تجربة السوق الرئيسي
2. ✅ اختبار الدردشة الذكية
3. ✅ إنشاء حساب بائع
4. ✅ إضافة منتج أول
5. ✅ اختبار عملية الدفع

---

**مستعد للبدء؟ اتبع الخطوات أعلاه واستمتع! 🎉**

For more details, see the complete [README.md](./README.md)
