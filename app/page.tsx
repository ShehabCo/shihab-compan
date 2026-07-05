export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Super App
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            منصة تجارة ذكية عربية
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          تطبيق موحد يجمع خدمات متعددة: محادثات فورية، ذكاء اصطناعي، متجر إلكتروني، محفظة رقمية، بث مباشر، وأكثر في مكان واحد.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold mb-2">محادثات فورية</h3>
            <p className="text-sm text-gray-600">تواصل آني وآمن</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold mb-2">ذكاء اصطناعي</h3>
            <p className="text-sm text-gray-600">مساعد ذكي عربي</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="font-bold mb-2">متجر إلكتروني</h3>
            <p className="text-sm text-gray-600">تسوق سهل وآمن</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/products" 
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            استكشف المنتجات
          </a>
          <a 
            href="/about" 
            className="px-8 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition shadow-md hover:shadow-lg"
          >
            عن التطبيق
          </a>
        </div>
      </div>
    </main>
  );
}
