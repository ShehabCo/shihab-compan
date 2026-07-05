# Environment Variables Setup Guide

## Required Environment Variables

Your Super Platform MVP needs 13 environment variables. All are already set via integrations.

### Supabase Variables
Get these from your Supabase project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_URL=https://your-project.supabase.co
```

### Stripe Variables
Get these from Stripe Dashboard:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx or pk_test_xxx
STRIPE_SECRET_KEY=sk_live_xxx or sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Groq Variables
Get this from Groq Console:

```env
GROQ_API_KEY=gsk_xxx
```

### Database (PostgreSQL)
Auto-configured by Supabase:

```env
POSTGRES_URL=postgresql://user:password@host:port/database
POSTGRES_PRISMA_URL=postgresql://user:password@host:port/database
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:port/database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=your-host
POSTGRES_DATABASE=postgres
```

## Setup Instructions

### 1. Local Development (.env.local)

Create `.env.local` in project root:

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
# or
code .env.local
```

Add all 13 variables from the integrations.

### 2. Verify Variables

```bash
# Check if variables are loaded
pnpm dev

# Look for any errors about missing env vars
# Groq should load without errors
# Stripe should connect
# Supabase should connect to database
```

### 3. Test Connection

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000
# Try:
# - Click AI Chat (tests Groq)
# - Try adding product to cart (tests Supabase)
# - Try checkout (tests Stripe in test mode)
```

## Production (Vercel)

### 1. Add to Vercel Project

```bash
# Via Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all 13 variables
```

### 2. Or via Dashboard

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable
4. Mark as "Production", "Preview", "Development" as needed

### 3. Verify on Vercel

Deploy and check:
```bash
vercel --prod
```

## Testing Variables

### Stripe (Test Mode)
Use these test card numbers:
- Success: `4242 4242 4242 4242`
- Failure: `4000 0000 0000 0002`
- Exp: Any future date
- CVC: Any 3 digits

### Groq
The AI chat will work immediately after setting `GROQ_API_KEY`

### Supabase
If set correctly:
- User profiles table should be accessible
- Products should load
- Orders should save

## Security Notes

- **Never commit .env.local** - it's in .gitignore
- **Keep secrets safe** - don't share keys
- **Use different keys** for dev/prod (Stripe has test/live keys)
- **Rotate keys regularly** - check integration dashboards

## Troubleshooting

### "GROQ_API_KEY is not defined"
- Check you added it to .env.local
- Restart dev server: `pnpm dev`

### "Supabase connection failed"
- Verify NEXT_PUBLIC_SUPABASE_URL is correct
- Check SUPABASE_SERVICE_ROLE_KEY is valid
- Test at https://your-supabase-url (should show login page)

### "Stripe is not configured"
- Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- Add STRIPE_SECRET_KEY
- Check if using test keys (pk_test_, sk_test_)

### "Module not found" errors
- First: Follow BUILD_CLEANUP.md
- Then: Verify all env vars are set
- Last: Check console for specific missing variable

## Next Steps

1. Set all 13 environment variables (they're all ready!)
2. Run `pnpm install` to ensure dependencies are correct
3. Run `pnpm dev` to start development server
4. Test each integration:
   - Groq: Click AI chat, type a message
   - Supabase: Add product to cart
   - Stripe: Try to checkout (test mode)
5. Ready to deploy when all tests pass!
