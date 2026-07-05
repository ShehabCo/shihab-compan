# دليل نشر مرة أم سليم

## النشر على Vercel (الخيار الأول الموصى به)

### الخطوة 1: إعداد GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit - Mara Umm Salim"
git branch -M main
git remote add origin https://github.com/yourusername/mara-umm-salim.git
git push -u origin main
```

### الخطوة 2: توصيل Vercel
1. اذهب إلى https://vercel.com/new
2. استورد الريبوزيتوري من GitHub
3. اختر المشروع
4. أضف متغيرات البيئة:
   - `NEXT_PUBLIC_API_URL` = `https://your-domain.vercel.app`
   - `NEXT_PUBLIC_SUPABASE_URL` = (من لوحة Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (من لوحة Supabase)

### الخطوة 3: النشر
انقر على "Deploy" وانتظر انتهاء البناء والنشر.

## إعداد Supabase (قاعدة البيانات)

### 1. إنشاء حساب Supabase
- اذهب إلى https://supabase.com
- سجل دخولك أو أنشئ حسابًا جديدًا
- أنشئ مشروعًا جديدًا

### 2. إنشاء الجداول المطلوبة

#### جدول المستخدمين
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  phone VARCHAR(20),
  full_name VARCHAR(255),
  password_hash VARCHAR(255),
  type VARCHAR(50) DEFAULT 'customer',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

#### جدول الأطباق
```sql
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_ar TEXT,
  price DECIMAL(10, 2),
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3, 2),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dishes_category ON dishes(category);
```

#### جدول الطلبات
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10, 2),
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  is_free_delivery BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

#### جدول عناصر الطلب
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  dish_id UUID NOT NULL REFERENCES dishes(id),
  quantity INTEGER DEFAULT 1,
  price_per_item DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. تكوين المصادقة في Supabase
1. اذهب إلى "Authentication" في Supabase
2. فعّل موفري المصادقة:
   - Email/Password
   - Google OAuth (ستحتاج إلى مفاتيح Google من Google Cloud Console)

### 4. نسخ مفاتيح الوصول
من "Settings" → "API":
- `Project URL` = `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` = `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## التكامل مع Gmail (لإرسال رسائل OTP)

### 1. إعداد Gmail API
1. اذهب إلى https://console.cloud.google.com
2. أنشئ مشروعًا جديدًا
3. فعّل Gmail API
4. أنشئ بيانات اعتماد (OAuth 2.0 Client ID)
5. احفظ client ID و client secret

### 2. إعداد البريد الإلكتروني للتطبيق
```javascript
// في route handler جديد: /app/api/email/send
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
})

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'رمز التحقق من مرة أم سليم',
    html: `<h1>رمز التحقق: ${otp}</h1>`,
  })
}
```

## التكامل مع Twilio (لإرسال SMS)

### 1. إعداد حساب Twilio
1. اذهب إلى https://www.twilio.com
2. سجل حسابًا جديدًا
3. احصل على Account SID و Auth Token
4. اشتر رقم هاتف

### 2. تثبيت مكتبة Twilio
```bash
npm install twilio
```

### 3. إنشاء API لإرسال SMS
```javascript
// في route handler جديد: /app/api/sms/send
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendOtpSms(phone: string, otp: string) {
  await client.messages.create({
    body: `رمز التحقق من مرة أم سليم: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}
```

## متغيرات البيئة المطلوبة

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# Twilio
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+1234567890

# API
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## اختبار التطبيق بعد النشر

1. **اختبر تسجيل الدخول**
   - جرّب تسجيل الدخول ببريد إلكتروني
   - جرّب تسجيل الدخول برقم هاتف
   - جرّب تسجيل الدخول عبر Google

2. **اختبر عملية الطلب**
   - تصفح القائمة
   - أضف أطباقًا إلى السلة
   - أكمل الطلب

3. **اختبر الولاء**
   - أكمل 3 طلبات
   - تحقق من أن الطلب الرابع مجاني التوصيل

4. **اختبر التتبع**
   - تابع حالة الطلب في الوقت الفعلي

## مراقبة الأداء

### استخدام Vercel Analytics
1. اذهب إلى لوحة Vercel
2. انقر على "Analytics"
3. راقب زمن الاستجابة والأداء

### استخدام Supabase Logs
1. اذهب إلى Supabase Dashboard
2. انقر على "Logs"
3. راقب استعلامات قاعدة البيانات

## الأمان والامتثال

### قائمة التحقق الأمانية
- [ ] فعّل HTTPS (تلقائي مع Vercel)
- [ ] احمِ بيانات OTP بتشفير
- [ ] استخدم JWT tokens مع Supabase
- [ ] فعّل RLS على جميع الجداول
- [ ] استخدم variables للمفاتيح السرية
- [ ] قم بمراجعة سياسة الخصوصية والشروط
- [ ] أكمل اختبار الأمان

## دعم الأداء

- **CDN**: Vercel يوفر CDN عالمي تلقائيًا
- **الذاكرة المؤقتة**: استخدم `next/image` لتحسين الصور
- **الضغط**: تفعيل gzip (افتراضي مع Vercel)

## خطوات ما بعد النشر

1. **ضع روابط التواصل**
   - أضف رقم الهاتف: +967 776 262 899
   - أضف البريد الإلكتروني للدعم

2. **اختبر الموقع على الهواتف الذكية**
   - iOS Safari
   - Android Chrome

3. **راقب السجلات الأولى**
   - تحقق من Vercel logs
   - تحقق من Supabase logs

4. **اجمع ملاحظات المستخدمين**
   - قيّم التجربة
   - أصلح أي مشاكل

---

**تم! تطبيقك جاهز للعمل الآن! 🎉**
