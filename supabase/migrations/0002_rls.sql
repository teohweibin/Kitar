-- Kitar 0002: Row Level Security.
-- Run after 0001. Every table has RLS on; nothing is readable without signing in.

-- Helpers read the caller's profile without triggering profile RLS (avoids recursive policies).
create or replace function public.my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.my_unit()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select unit_id from public.profiles where id = auth.uid()
$$;

revoke execute on function public.my_role() from public, anon;
revoke execute on function public.my_unit() from public, anon;
grant execute on function public.my_role() to authenticated;
grant execute on function public.my_unit() to authenticated;

alter table public.townships enable row level security;
alter table public.units enable row level security;
alter table public.profiles enable row level security;
alter table public.waste_categories enable row level security;
alter table public.waste_items enable row level security;
alter table public.collections enable row level security;

-- Table privileges for signed-in users; RLS below decides which rows.
grant select on public.townships, public.units, public.profiles,
  public.waste_categories, public.waste_items, public.collections to authenticated;
grant insert on public.collections to authenticated;

-- Reference data: any signed-in user can read.
create policy "Signed-in users read townships" on public.townships
  for select to authenticated using (true);

create policy "Signed-in users read categories" on public.waste_categories
  for select to authenticated using (true);

create policy "Signed-in users read guide items" on public.waste_items
  for select to authenticated using (true);

-- Units: residents see only their own; collectors look up any bag; admins see all.
create policy "Residents read their own unit" on public.units
  for select to authenticated
  using (public.my_role() = 'resident' and id = public.my_unit());

create policy "Collectors and admins read units" on public.units
  for select to authenticated
  using (public.my_role() in ('collector', 'admin'));

-- Profiles: own row; admins see all.
create policy "Users read their own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "Admins read all profiles" on public.profiles
  for select to authenticated
  using (public.my_role() = 'admin');

-- Collections: append-only. No update or delete policies, so nobody can change a saved record.
create policy "Residents read their unit's collections" on public.collections
  for select to authenticated
  using (public.my_role() = 'resident' and unit_id = public.my_unit());

create policy "Collectors read what they recorded" on public.collections
  for select to authenticated
  using (public.my_role() = 'collector' and collector_id = auth.uid());

create policy "Admins read all collections" on public.collections
  for select to authenticated
  using (public.my_role() = 'admin');

create policy "Collectors record collections as themselves" on public.collections
  for insert to authenticated
  with check (public.my_role() = 'collector' and collector_id = auth.uid());
