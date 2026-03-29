'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold mb-8">شروط الخدمة</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. قبول الشروط</h2>
            <p>
              باستخدام منصة Super Platform، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي
              جزء منها، يرجى عدم استخدام المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. استخدام الحساب</h2>
            <p>
              أنت مسؤول عن الحفاظ على سرية كلمة المرور وتسجيل الدخول. تتعهد بعدم مشاركة حسابك مع أي
              شخص آخر وتتقبل المسؤولية الكاملة عن جميع الأنشطة التي تحدث تحت حسابك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. القوانين والعقوبات</h2>
            <p>
              يحظر عليك استخدام المنصة لأي غرض غير قانوني أو ضار. نحتفظ بالحق في إيقاف أو حذف حسابك
              في حالة انتهاك هذه الشروط.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. حقوق الملكية الفكرية</h2>
            <p>
              جميع محتويات المنصة بما في ذلك النصوص والصور والشعار هي ملك لـ Super Platform وحماية
              بموجب قوانين حقوق الملكية الفكرية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. إخلاء المسؤولية</h2>
            <p>
              تُقدم المنصة "كما هي" بدون أي ضمانات. لا نتحمل مسؤولية أي أضرار ناشئة عن استخدام المنصة
              أو عدم توفرها.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. تعديل الشروط</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد
              الإلكتروني.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. التواصل معنا</h2>
            <p>
              إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا على:
              <br />
              البريد: support@superplatform.com
              <br />
              الهاتف: +967 781 178 250
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/">
            <Button variant="outline">العودة للرئيسية</Button>
          </Link>
          <Link href="/privacy">
            <Button variant="outline">سياسة الخصوصية</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
