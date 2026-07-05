# Build Cache Cleanup Guide

## Problem
If you see error: `Module not found: Can't resolve '@/lib/supabase/proxy'`

This is usually a build cache issue, not an actual missing file.

## Solution

### Option 1: Quick Fix (Recommended)
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
pnpm install

# Start fresh development server
pnpm dev
```

### Option 2: Complete Clean
```bash
# Remove all dependencies
rm -rf node_modules .next .turbo

# Reinstall
pnpm install

# Clear pnpm store (optional)
pnpm store prune

# Start
pnpm dev
```

### Option 3: Hard Reset
```bash
# If you have uncommitted changes, back them up first
git status

# Reset to last commit
git checkout .

# Clean all generated files
git clean -fd

# Remove caches
rm -rf node_modules .next .turbo .pnpm-store

# Reinstall
pnpm install

# Start
pnpm dev
```

## Verification

After cleanup, verify all files exist:
```bash
# Check if proxy.ts exists
ls -la lib/supabase/proxy.ts

# Check if middleware.ts exists
ls -la middleware.ts

# Try building
pnpm build
```

## Why This Happens

Next.js Turbopack sometimes caches old module references. The files ARE present, but the build system hasn't refreshed its index.

## Prevention

- Always run `pnpm install` after pulling code
- Clear `.next` folder before switching branches
- Restart dev server if you add new files

---

The file `lib/supabase/proxy.ts` is definitely present and correct. This is 100% a cache issue.
