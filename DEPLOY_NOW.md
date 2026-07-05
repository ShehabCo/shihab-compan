# Deploy Super Platform MVP Now

All build errors have been fixed! Follow these steps to deploy:

## Step 1: Verify Locally First

```bash
# Clean installation
rm -rf node_modules .next pnpm-lock.yaml
pnpm install

# Build test
pnpm build

# Test in dev
pnpm dev
```

Visit: http://localhost:3000

## Step 2: Push to GitHub

```bash
git add .
git commit -m "fix: resolve build errors - stripe imports and groq sdk"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard
1. Go to https://vercel.com
2. Connect GitHub repo if not already
3. Import project
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `GROQ_API_KEY`
5. Click Deploy

### Option B: Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel deploy --prod

# Add env vars when prompted
```

## Step 4: Configure Database

1. In Supabase dashboard, run migration:
```sql
-- Execute the script from /scripts/001_create_tables.sql
```

2. Enable RLS policies (already in script)

## Step 5: Test Production

After deployment:
- Visit your Vercel URL
- Test signup/login
- Test AI chat
- Test payment flow (test Stripe keys)

## Environment Variables Needed

Get these from your integrations:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - From Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` - From Settings > API (Secret)

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From API Keys
- `STRIPE_SECRET_KEY` - From API Keys (Secret)
- `STRIPE_WEBHOOK_SECRET` - From Webhooks (after setup)

### Groq
- `GROQ_API_KEY` - From API Keys

## Health Check

After deployment, verify:
- ✅ Site loads at custom domain
- ✅ Homepage displays
- ✅ API routes respond (check `/api/v1/health`)
- ✅ AI chat works
- ✅ Stripe checkout initiates
- ✅ Database connects

## Troubleshooting

If you see errors:

1. **Build fails**: Check `BUILD_FIXES_APPLIED.md`
2. **API 500 errors**: Check env vars are set
3. **Database errors**: Verify migration ran
4. **Stripe errors**: Verify webhook secret

## Performance Optimization (Next Steps)

After deployment works:

1. Add image optimization
2. Enable caching headers
3. Compress assets
4. Monitor analytics

## Success!

Your Super Platform MVP is now live and ready for:
- Testing
- User feedback collection
- Performance optimization
- Feature additions

**Domain:** yourname.vercel.app
**Dashboard:** https://vercel.com/dashboard
