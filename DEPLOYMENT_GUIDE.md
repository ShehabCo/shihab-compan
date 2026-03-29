# Super Platform - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
```
- Node.js 18+
- Git
- Vercel Account
- Supabase Account
- Stripe Account
- Groq API Key
```

---

## 🔧 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourname/super-platform.git
cd super-platform
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Variables
اسنسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Groq
GROQ_API_KEY=your_groq_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Database Migrations
```bash
# Execute Supabase migrations
supabase migration up
```

### 5. Start Development Server
```bash
npm run dev
```

Access the app at `http://localhost:3000`

---

## 🏗️ Vercel Production Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: MVP Super Platform"
git push origin main
```

### 2. Connect to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect GitHub repo through Vercel Dashboard.

### 3. Set Environment Variables in Vercel
Go to Project Settings → Environment Variables

Add all variables from `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
GROQ_API_KEY
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Configure Custom Domain
1. Go to Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records

### 5. Deploy
```bash
# Automatic deployment on push to main
# Or manual deployment
vercel --prod
```

---

## 🗄️ Supabase Production Setup

### 1. Create Project
- Go to [Supabase Dashboard](https://supabase.com)
- Click "New Project"
- Choose region (recommended: closest to your users)
- Set strong password

### 2. Run Migrations
```bash
# Connect to your Supabase project
supabase link --project-ref your_project_ref

# Apply migrations
supabase migration up
```

Or manually execute SQL from `scripts/001_create_tables.sql` in Supabase SQL Editor.

### 3. Enable RLS (Row Level Security)
All tables have RLS policies configured in migrations.

Verify in Supabase Dashboard:
```
1. Go to Database → Tables
2. For each table, check "RLS enabled"
3. Verify policies are set correctly
```

### 4. Setup Backups
```
1. Go to Settings → Backups
2. Enable automated daily backups
3. Configure backup retention
```

### 5. Configure Replication (Optional)
For high availability:
```sql
-- Supabase handles this automatically
-- But you can add read replicas in Settings
```

---

## 💳 Stripe Production Setup

### 1. Upgrade to Live Keys
- Go to Stripe Dashboard
- Settings → API Keys
- Switch to Live mode
- Copy Live keys

### 2. Configure Webhook
```bash
# Get your production URL
vercel --prod

# Add webhook in Stripe Dashboard
# Events URL: https://yourdomain.com/api/v1/webhooks/stripe
# Events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
```

### 3. Test Live Payments
```bash
# Use Stripe test cards in production environment
# Verify webhook delivery in Stripe Dashboard
```

---

## 🤖 Groq API Production Setup

### 1. Create Production API Key
- Go to [Groq Console](https://console.groq.com)
- Create new API key
- Copy key to environment variables

### 2. Set Rate Limits
```
- Requests per minute: 100
- Tokens per minute: 50000
```

### 3. Monitor Usage
- Dashboard shows current usage
- Set up billing alerts
- Monitor model performance

---

## 📊 Monitoring & Observability

### Vercel Analytics
```
1. Dashboard → Analytics
2. Monitor:
   - Page views
   - Response times
   - Error rates
   - Core Web Vitals
```

### Uptime Monitoring
```bash
# Use Vercel Analytics or third-party like UptimeRobot
# Configure alerts for downtime
```

### Error Tracking (Optional: Sentry)
```javascript
// Install Sentry
npm install @sentry/nextjs

// Initialize in next.config.js
const withSentryConfig = require("@sentry/nextjs/withSentryConfig");

module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "your-project",
});
```

---

## 🔒 Security Checklist

### Before Production

```
☐ Environment variables not committed to Git
☐ Database backups enabled
☐ SSL/TLS certificate configured
☐ CORS properly configured
☐ API rate limiting enabled
☐ SQL injection prevention (parameterized queries)
☐ XSS protection enabled
☐ CSRF tokens implemented
☐ Password hashing (bcrypt)
☐ Input validation on all endpoints
☐ Security headers configured
```

### Security Headers (Next.js)
```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - run: npm run build
      
      - run: npm run test
      
      - uses: vercel/action@v5
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

---

## 📈 Scaling Strategy

### As Traffic Grows

**Phase 1: <10K Users**
- Current setup is sufficient
- Monitor database performance

**Phase 2: 10K-100K Users**
```
- Add Redis caching layer
- Implement database connection pooling
- Enable CDN (Cloudflare)
- Optimize database queries
```

**Phase 3: 100K+ Users**
```
- Database read replicas
- Microservices architecture
- Message queue (Bull/RabbitMQ)
- Advanced monitoring
```

---

## 🚨 Incident Response

### Database Down
```bash
1. Check Supabase Status Dashboard
2. Failover to backup (if configured)
3. Check recent migrations for issues
4. Rollback if necessary
5. Notify users
```

### Payment Processing Issues
```bash
1. Check Stripe Status
2. Review webhook logs
3. Contact Stripe support
4. Use fallback payment method
```

### AI Service Down
```bash
1. Check Groq Status
2. Implement graceful degradation
3. Use cached responses
4. Fall back to search
```

---

## 📝 Rollback Procedure

### Rollback to Previous Version
```bash
# Using Vercel
vercel rollback

# Or redeploy specific commit
vercel --yes --env-file=.env.production
```

### Database Rollback
```bash
# Using Supabase
supabase db pull
supabase db reset
# Restore from backup
```

---

## 🧪 Testing Before Deployment

### Pre-deployment Checklist
```bash
# Run tests
npm run test

# Build locally
npm run build

# Start production build
npm run start

# Test in staging
vercel --env-file=.env.staging
```

### Performance Testing
```bash
# Lighthouse
npm run lighthouse

# Load testing with k6
npm run load-test
```

---

## 📊 Monitoring Commands

### Check Application Health
```bash
# Vercel CLI
vercel list
vercel logs

# Check recent deployments
vercel deployments
```

### Database Health
```bash
# Connect to Supabase
psql "postgres://user:password@db.url/postgres"

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 💰 Cost Optimization

### Estimated Monthly Costs
```
Vercel: $20-100/month
  - Pro plan: $20
  - Additional compute: based on usage

Supabase: $25-100/month
  - Pro plan: $25
  - Database storage: based on usage
  - Bandwidth: based on usage

Stripe: 2.9% + $0.30 per transaction
  - Example: 1000 orders at $50 avg = ~$1500 fees

Groq: Pay-as-you-go
  - ~$0.001-0.01 per request
  - Example: 10K requests = $10-100

Total: $100-1000/month depending on scale
```

### Cost Reduction Tips
```
1. Use serverless functions efficiently
2. Implement caching (Redis)
3. Optimize database queries
4. Monitor and alert on costs
5. Use reserved capacity (future)
```

---

## 📞 Support & Resources

### Documentation
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- Groq: https://console.groq.com/docs

### Useful Commands
```bash
# Check Node version
node --version

# Check dependencies for updates
npm outdated

# Audit security
npm audit

# Update dependencies
npm update

# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next Steps After Deployment

1. **Monitor** - Set up alerts and monitoring
2. **Test** - Run smoke tests on production
3. **Backup** - Verify backups are working
4. **Scale** - Monitor and scale as needed
5. **Improve** - Collect metrics and optimize

---

**Last Updated:** February 2024
**Status:** Production Ready
