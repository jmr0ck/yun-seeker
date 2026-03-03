-- yun-seeker Supabase schema (Option B: Auth required)
--
-- Goals:
-- - Store user profiles and reports
-- - Require Supabase Auth (no anon writes)
-- - Row-level security: users can only access their own rows
--
-- Notes:
-- - We key data by auth.uid() (not email) for strong ownership.
-- - Email can still be stored as a convenience column.

-- Extensions
create extension if not exists pgcrypto;

-- PROFILES
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  language text,
  timezone text,
  dob date,
  tob time,
  pob text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);

-- REPORTS
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asked_at timestamptz,
  title text,
  question text,
  summary text,
  confidence text,
  focus text,
  highlights jsonb,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists reports_asked_at_idx on public.reports(asked_at desc);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.reports enable row level security;

-- PROFILES policies
-- Users can read/write only their own profile.
create policy if not exists "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy if not exists "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy if not exists "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- REPORTS policies
create policy if not exists "reports_select_own"
  on public.reports for select
  using (auth.uid() = user_id);

create policy if not exists "reports_insert_own"
  on public.reports for insert
  with check (auth.uid() = user_id);

-- Optional: block updates/deletes (append-only)
create policy if not exists "reports_no_update"
  on public.reports for update
  using (false);

create policy if not exists "reports_no_delete"
  on public.reports for delete
  using (false);
