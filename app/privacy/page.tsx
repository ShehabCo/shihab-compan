'use client'

import { AppProvider } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

function PrivacyContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">سياسة الخصوصية</h1>
        <p className="text-gray-600 mb-8">آخر تحديث: يناير 2024</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. مقدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              SmartAI World (نحن) نقدر خصوصيتك. هذه السياسة توضح كيفية جمع وحماية واستخدام بياناتك الشخصية. باستخدام موقعنا، فأنت توافق على شروط هذه السياسة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. البيانات التي نجمعها</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">البيانات التي تقدمها مباشرة:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>الاسم والبريد الإلكتروني</li>
                  <li>معلومات الحساب والتسجيل</li>
                  <li>معلومات الدفع والعنوان</li>
                  <li>المراسلات والتواصل معنا</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">البيانات التي يتم جمعها تلقائياً:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>بيانات الجهاز والمتصفح</li>
                  <li>عناوين IP</li>
                  <li>سجل الاستخدام والأنشطة</li>
                  <li>ملفات تعريف الارتباط (Cookies)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. كيف نستخدم بيانات</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>تقديم وتحسين خدماتنا</li>
              <li>معالجة الطلبات والمدفوعات</li>
              <li>الاتصال بك حول حسابك</li>
              <li>إرسال عروض خاصة وتحديثات</li>
              <li>الامتثال للقوانين واللوائح</li>
              <li>منع الاحتيال والحفاظ على الأمان</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. حماية البيانات</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              نستخدم تقنيات التشفير المتقدمة لحماية بيانات العملاء. جميع المعاملات المالية محمية بـ SSL/TLS.
            </p>
            <p className="text-gray-700 leading-relaxed">
              بيانات العملاء محفوظة في خوادم آمنة مع نسخ احتياطية دورية وإجراءات حماية متقدمة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. مشاركة البيانات</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              لا نشارك بياناتك الشخصية مع أطراف ثالثة بدون موافقك، باستثناء:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>خدمات الدفع والشحن</li>
              <li>متطلبات قانونية حكومية</li>
              <li>حماية حقوقنا والعملاء الآخرين</li>
              <li>مع مزودي الخدمات الموثوقين</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. حقوقك</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              لديك الحق في:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>تصحيح البيانات غير الدقيقة</li>
              <li>حذف حسابك وبيانات</li>
              <li>الاعتراض على استخدام البيانات</li>
              <li>سحب الموافقة في أي وقت</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. ملفات تعريف الارتباط</h2>
            <p className="text-gray-700 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك إيقاف تشغيلها من إعدادات متصفحك، لكن قد يؤثر على وظائف الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. اتصال بنا</h2>
            <p className="text-gray-700 leading-relaxed">
              إذا كان لديك أسئلة حول هذه السياسة أو بيانات:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>البريد الإلكتروني:</strong> mmzz770999184@gmail.com
              </p>
              <p className="text-gray-700">
                <strong>الهاتف:</strong> +967 781 178 250
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. التغييرات في السياسة</h2>
            <p className="text-gray-700 leading-relaxed">
              قد نحدث هذه السياسة من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال الموقع.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <AppProvider>
      <PrivacyContent />
    </AppProvider>
  )
}

// Super Platform MVP - Privacy Policy Page
// Updated for GDPR and international compliance standards
