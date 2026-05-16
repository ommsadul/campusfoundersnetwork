-- Campus Founders Network: RLS + indexes for profiles and connections
-- Run this in Supabase SQL editor (or your migration pipeline).

begin;

-- Safety: enable pgcrypto for gen_random_uuid() if needed by your schema.
create extension if not exists pgcrypto;

-- -------------------------------------------------------------------------
-- profiles
-- -------------------------------------------------------------------------

alter table if exists public.profiles enable row level security;

-- Drop existing policies if they exist so this script is idempotent.
drop policy if exists "profiles_select_completed_or_self" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

-- Read: users can read completed profiles; users can always read their own profile.
create policy "profiles_select_completed_or_self"
on public.profiles
for select
to authenticated
using (
  profile_completed = true
  or id = auth.uid()
);

-- Insert: user may only create their own profile row.
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
);

-- Update: user may only update their own profile row.
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);

-- Optional: block deletes from client role.
revoke delete on table public.profiles from authenticated;

-- Helpful indexes for dashboard filters.
create index if not exists idx_profiles_completed_technical
  on public.profiles (profile_completed, is_technical);

create index if not exists idx_profiles_startup_areas_gin
  on public.profiles using gin (startup_areas);

-- -------------------------------------------------------------------------
-- connections
-- -------------------------------------------------------------------------

alter table if exists public.connections enable row level security;

-- Drop existing policies if they exist so this script is idempotent.
drop policy if exists "connections_select_sender_or_receiver" on public.connections;
drop policy if exists "connections_insert_sender_only" on public.connections;
drop policy if exists "connections_update_participants" on public.connections;

-- Read: sender or receiver can view the connection row.
create policy "connections_select_sender_or_receiver"
on public.connections
for select
to authenticated
using (
  sender_id = auth.uid()
  or receiver_id = auth.uid()
);

-- Insert: sender must be current user; cannot connect to self; status locked to PENDING.
create policy "connections_insert_sender_only"
on public.connections
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and sender_id <> receiver_id
  and status = 'PENDING'
);

-- Update: only participants can update rows (tighten further if needed).
create policy "connections_update_participants"
on public.connections
for update
to authenticated
using (
  sender_id = auth.uid()
  or receiver_id = auth.uid()
)
with check (
  sender_id = auth.uid()
  or receiver_id = auth.uid()
);

-- Optional: block deletes from client role.
revoke delete on table public.connections from authenticated;

-- Prevent duplicate pending requests between the same pair.
create unique index if not exists uq_connections_pending_pair
  on public.connections (sender_id, receiver_id)
  where status = 'PENDING';

-- Fast lookups for inbox/sent/relationship checks.
create index if not exists idx_connections_sender_receiver_status
  on public.connections (sender_id, receiver_id, status);

create index if not exists idx_connections_receiver_status
  on public.connections (receiver_id, status);

commit;
