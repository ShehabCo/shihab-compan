# Super Platform - Complete API Documentation

## 📚 Base URL
```
Development: http://localhost:3000/api/v1
Production: https://superplatform.com/api/v1
```

## 🔐 Authentication
جميع الـ endpoints التي تحتاج مصادقة تتطلب JWT token في headers:

```http
Authorization: Bearer <session_token>
```

الحصول على token عبر Supabase Auth.

---

## 📦 Products API

### GET /api/v1/products
الحصول على قائمة المنتجات مع الفلاتر

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | البحث في اسم المنتج |
| `category` | string | تصفية حسب الفئة |
| `page` | number | رقم الصفحة (default: 1) |
| `limit` | number | عدد النتائج (default: 20) |
| `min_price` | number | السعر الأدنى |
| `max_price` | number | السعر الأقصى |
| `sort` | string | ترتيب (latest, price-asc, price-desc, rating) |

**Request:**
```bash
curl "http://localhost:3000/api/v1/products?search=laptop&category=electronics&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Laptop Pro 15",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "electronics",
      "images": ["url1", "url2"],
      "rating": 4.8,
      "reviews": 245,
      "stock": 50,
      "seller": {
        "id": "uuid",
        "name": "Tech Store",
        "rating": 4.9
      },
      "created_at": "2024-02-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### POST /api/v1/products
إنشاء منتج جديد (البائعون فقط)

**Required Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "منتج جديد",
  "description": "وصف المنتج",
  "category": "electronics",
  "price": 99.99,
  "stock": 50,
  "images": ["image_url_1", "image_url_2"],
  "specifications": {
    "color": "أسود",
    "size": "M"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "seller_id": "uuid",
    "name": "منتج جديد",
    "price": 99.99,
    "stock": 50,
    "is_active": true,
    "created_at": "2024-02-10T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Not a seller"
}
```

---

### GET /api/v1/products/:id
الحصول على تفاصيل المنتج

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Laptop Pro 15",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "electronics",
    "images": ["url1", "url2"],
    "rating": 4.8,
    "reviews": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "rating": 5,
        "comment": "منتج ممتاز!",
        "created_at": "2024-02-01T10:00:00Z"
      }
    ],
    "seller": {
      "id": "uuid",
      "name": "Tech Store",
      "rating": 4.9
    },
    "stock": 50,
    "created_at": "2024-02-10T10:00:00Z"
  }
}
```

---

### PUT /api/v1/products/:id
تحديث المنتج (البائع فقط)

**Request Body:**
```json
{
  "name": "منتج محدث",
  "price": 89.99,
  "stock": 45,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "منتج محدث",
    "price": 89.99,
    "stock": 45,
    "updated_at": "2024-02-10T11:00:00Z"
  }
}
```

---

## 🛒 Orders API

### GET /api/v1/orders
الحصول على طلبات المستخدم

**Required:**
- Authentication header

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-uuid",
      "user_id": "user-uuid",
      "total_amount": 209.98,
      "status": "confirmed",
      "shipping_address": {
        "full_name": "أحمد محمد",
        "address": "شارع النيل",
        "city": "القاهرة",
        "zip": "12345",
        "country": "مصر"
      },
      "items": [
        {
          "id": "item-uuid",
          "product_id": "product-uuid",
          "product_name": "منتج 1",
          "quantity": 2,
          "price": 99.99
        }
      ],
      "payment": {
        "status": "completed",
        "method": "stripe"
      },
      "created_at": "2024-02-10T10:00:00Z",
      "updated_at": "2024-02-10T11:00:00Z"
    }
  ]
}
```

---

### POST /api/v1/orders
إنشاء طلب جديد

**Request Body:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shipping_address": {
    "full_name": "أحمد محمد",
    "address": "شارع النيل",
    "city": "القاهرة",
    "zip": "12345",
    "country": "مصر"
  },
  "total_amount": 209.98
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "pending_payment",
    "total_amount": 209.98,
    "created_at": "2024-02-10T10:30:00Z"
  }
}
```

---

### GET /api/v1/orders/:id
الحصول على تفاصيل الطلب

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "confirmed",
    "total_amount": 209.98,
    "items": [...],
    "payment": {...},
    "tracking": {
      "carrier": "DHL",
      "tracking_number": "1234567890",
      "status": "in_transit"
    }
  }
}
```

---

## 💬 AI Chat API

### POST /api/v1/ai/chat
إرسال رسالة إلى المساعد الذكي

**Request Body:**
```json
{
  "message": "أبحث عن laptop بسعر أقل من 500 دولار",
  "conversation_id": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "message": "لقد وجدت 5 laptops بسعر أقل من 500 دولار. هل تريد المزيد من التفاصيل عن أي منها؟",
    "products": [
      {
        "id": "uuid",
        "name": "Laptop Budget 15",
        "price": 399.99
      }
    ]
  }
}
```

---

### GET /api/v1/ai/conversations/:id
الحصول على سجل المحادثة

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "conversation-uuid",
    "messages": [
      {
        "role": "user",
        "content": "أبحث عن laptop",
        "created_at": "2024-02-10T10:00:00Z"
      },
      {
        "role": "assistant",
        "content": "هناك عدة خيارات متاحة...",
        "created_at": "2024-02-10T10:01:00Z"
      }
    ]
  }
}
```

---

## 💳 Payment API

### POST /api/v1/payments/create-session
إنشاء جلسة دفع Stripe

**Request Body:**
```json
{
  "order_id": "uuid",
  "amount": 209.98,
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "cs_live_xxx",
    "client_secret": "xxx",
    "publishable_key": "pk_live_xxx"
  }
}
```

---

### GET /api/v1/payments/:order_id
الحصول على حالة الدفع

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "uuid",
    "payment_id": "uuid",
    "status": "completed",
    "amount": 209.98,
    "currency": "USD",
    "stripe_payment_id": "ch_xxx",
    "created_at": "2024-02-10T10:00:00Z"
  }
}
```

---

## 🪝 Webhooks

### POST /api/v1/webhooks/stripe
Stripe Webhook Handler

**Events Handled:**
- `payment_intent.succeeded` - الدفع نجح
- `payment_intent.payment_failed` - الدفع فشل
- `charge.refunded` - استرجاع المبلغ

**Signature Verification:**
```javascript
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
```

---

## 👤 User & Seller API

### GET /api/v1/users/profile
الحصول على بيانات المستخدم

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "customer",
    "profile": {
      "full_name": "أحمد محمد",
      "avatar_url": "url",
      "bio": "مشتري نشيط"
    }
  }
}
```

---

### POST /api/v1/sellers/register
تسجيل بائع جديد

**Request Body:**
```json
{
  "shop_name": "متجري",
  "description": "وصف المتجر",
  "category": "electronics",
  "phone": "+966123456789",
  "address": "الرياض"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "seller_id": "uuid",
    "shop_name": "متجري",
    "status": "pending_verification"
  }
}
```

---

## 📊 Analytics API (Future)

### GET /api/v1/analytics/sales
الحصول على بيانات المبيعات

**Query Parameters:**
| Parameter | Type |
|-----------|------|
| `date_from` | ISO date |
| `date_to` | ISO date |
| `group_by` | day/week/month |

**Response:**
```json
{
  "success": true,
  "data": {
    "total_sales": 45000,
    "total_orders": 150,
    "average_order_value": 300,
    "conversion_rate": 0.035,
    "daily_data": [...]
  }
}
```

---

## ❌ Error Handling

جميع الـ errors تتبع هذا الشكل:

```json
{
  "success": false,
  "error": "Error message",
  "code": "error_code",
  "details": {}
}
```

**Common Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 🔄 Rate Limiting

```
- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 1000 requests/minute per user
- Payment endpoints: 10 requests/minute per user
```

Header response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707562200
```

---

## 📝 Request/Response Examples

### cURL Examples

**Get Products:**
```bash
curl -X GET "http://localhost:3000/api/v1/products?category=electronics&limit=5"
```

**Create Order:**
```bash
curl -X POST "http://localhost:3000/api/v1/orders" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product_id": "uuid", "quantity": 1, "price": 99.99}],
    "shipping_address": {...},
    "total_amount": 99.99
  }'
```

**AI Chat:**
```bash
curl -X POST "http://localhost:3000/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "أبحث عن laptop",
    "conversation_id": "optional-uuid"
  }'
```

---

## 🔗 SDK/Client Libraries (Future)

```javascript
// JavaScript/TypeScript
import { SuperPlatformClient } from '@superplatform/sdk';

const client = new SuperPlatformClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://superplatform.com/api/v1'
});

const products = await client.products.list({ category: 'electronics' });
const order = await client.orders.create({ items: [...] });
```

---

## 📞 Support

للأسئلة والدعم:
- Email: api-support@superplatform.com
- Docs: https://docs.superplatform.com
- Status: https://status.superplatform.com

---

**Last Updated:** February 2024
**API Version:** v1.0
