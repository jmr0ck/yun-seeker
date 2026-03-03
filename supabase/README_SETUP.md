# Supabase Setup (Option B: Auth required)

## 1) Create project
- Create a Supabase project (e.g. `yun-seeker`)
- Save:
  - Project URL
  - `anon` public key

## 2) Run schema
- In Supabase dashboard → SQL editor
- Paste + run: `supabase/schema.sql`

This creates:
- `public.profiles` keyed by `user_id = auth.users.id`
- `public.reports` append-only, keyed by `user_id`
- RLS policies so users can only read/write their own rows

## 3) Configure Auth
Recommended for MVP:
- Enable Email provider (magic link / OTP)
- (Optional) Disable signups if you want closed beta

## 4) Add app environment variables (local, do not commit)
Create `.env` in repo root:
```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## 5) App code changes required
Current app uses REST upsert keyed by `email` and does not authenticate with Supabase.

For Option B, the app must:
- Sign in via Supabase Auth
- Use Supabase client (`@supabase/supabase-js`) with the user session
- Write rows with `user_id = session.user.id`

If you want, we can keep local-first AsyncStorage, but remote sync requires an authenticated session.
