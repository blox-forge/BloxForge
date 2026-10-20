-- BLOXFORGE identity foundation. Apply only after verifying project ownership.
-- Supabase Auth owns credentials; this table contains profile data only.
create table if not exists public.bf_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bf_profiles enable row level security;
revoke all on public.bf_profiles from anon;
grant select, insert, update on public.bf_profiles to authenticated;

drop policy if exists "bf_profiles_read_own" on public.bf_profiles;
create policy "bf_profiles_read_own" on public.bf_profiles for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "bf_profiles_insert_own" on public.bf_profiles;
create policy "bf_profiles_insert_own" on public.bf_profiles for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "bf_profiles_update_own" on public.bf_profiles;
create policy "bf_profiles_update_own" on public.bf_profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create or replace function public.bf_create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.bf_profiles(user_id, display_name)
  values (new.id, coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists bf_auth_user_profile on auth.users;
create trigger bf_auth_user_profile after insert on auth.users
for each row execute function public.bf_create_profile_for_new_user();

create or replace function public.bf_touch_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists bf_profiles_updated_at on public.bf_profiles;
create trigger bf_profiles_updated_at before update on public.bf_profiles
for each row execute function public.bf_touch_profile_updated_at();
