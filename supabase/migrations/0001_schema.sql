-- Kitar 0001: tables.
-- Run in Supabase → SQL Editor, before 0002 and 0003.

create table public.townships (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_sample boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  township_id uuid not null references public.townships (id) on delete cascade,
  unit_code text not null unique,
  -- The QR code on the bag holds only this random token, never personal data.
  qr_token text not null unique default gen_random_uuid()::text,
  created_at timestamptz not null default now()
);

create index units_township_id_idx on public.units (township_id);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('resident', 'collector', 'admin')),
  unit_id uuid references public.units (id) on delete set null,
  display_name text not null,
  created_at timestamptz not null default now(),
  constraint residents_have_a_unit check (role <> 'resident' or unit_id is not null)
);

create table public.waste_categories (
  id text primary key,
  name_en text not null,
  name_ms text not null,
  bin_colour text not null,
  points_per_kg integer not null check (points_per_kg >= 0),
  -- CO2e is shown only when a factor and its source are both filled in.
  co2e_kg_per_kg numeric,
  co2e_source text,
  sort_order integer not null default 0,
  constraint co2e_factor_needs_source check ((co2e_kg_per_kg is null) = (co2e_source is null))
);

create table public.waste_items (
  id uuid primary key default gen_random_uuid(),
  name_en text not null unique,
  name_ms text not null,
  -- null = not recyclable through Kitar
  category_id text references public.waste_categories (id),
  prep_steps text[] not null default '{}',
  keywords text[] not null default '{}',
  -- MobileNet (ImageNet) class names that should suggest this item
  model_labels text[] not null default '{}'
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id),
  collector_id uuid not null references public.profiles (id),
  category_id text not null references public.waste_categories (id),
  weight_kg numeric(5, 2) not null check (weight_kg > 0 and weight_kg <= 50),
  collected_at timestamptz not null default now()
);

create index collections_unit_id_idx on public.collections (unit_id);
create index collections_collected_at_idx on public.collections (collected_at);
create index collections_collector_id_idx on public.collections (collector_id);
