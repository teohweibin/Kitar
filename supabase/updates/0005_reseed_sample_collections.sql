-- Kitar update 0005: regenerate the sample collections with real randomness.
-- Run in Supabase → SQL Editor after 0004. Needed only if you ran seed.sql before this fix
-- (symptoms: only 18 of 30 units have data, every unit has exactly 36 collections, and only
-- paper, plastic and metal appear).
--
-- It deletes the OLD SAMPLE rows only: those recorded by collector1@demo.test on a Saturday
-- between 10:00 and 13:00 (session time zone, UTC in Supabase, as the seed wrote them). Collections you saved through the
-- app at other times are kept.

begin;

delete from public.collections c
using auth.users u
where u.id = c.collector_id
  and u.email = 'collector1@demo.test'
  and extract(isodow from c.collected_at) = 6
  and c.collected_at::time between time '10:00' and time '13:00';

select setseed(0.42);

insert into public.collections (unit_id, collector_id, category_id, weight_kg, collected_at)
select
  un.id,
  collector.id,
  cat.id,
  round((0.3 + item.weight_draw * cat.max_kg)::numeric, 1),
  wk.day + interval '10 hours' + item.time_draw * interval '3 hours'
from public.units un
cross join (select id from auth.users where email = 'collector1@demo.test') as collector
cross join lateral (
  select gs::date as day, random() as takes_part
  from generate_series(
    date_trunc('week', now()) - interval '12 weeks' + interval '5 days',
    now(),
    interval '1 week'
  ) as gs
  where un.id is not null
) as wk
cross join (values
  ('paper', 3.5, 0.70), ('plastic', 2.5, 0.75), ('metal', 1.2, 0.45), ('glass', 2.0, 0.30),
  ('carton', 0.8, 0.50), ('ewaste', 1.5, 0.04), ('textile', 2.5, 0.08), ('cooking_oil', 1.0, 0.10)
) as cat (id, max_kg, chance)
cross join lateral (
  select random() as brings, random() as weight_draw, random() as time_draw
  where cat.id is not null and wk.day is not null and un.id is not null
) as item
-- (no "collections is empty" guard here: the old sample rows were just deleted)
  where true
  -- does this unit take part this week? A ≈ 80 %, B ≈ 60 %, C ≈ 40 %
  and wk.takes_part < case
    when un.unit_code like 'SAMPLE-A-%' then 0.8
    when un.unit_code like 'SAMPLE-B-%' then 0.6
    else 0.4
  end
  -- and does it bring this category that week?
  and item.brings < cat.chance;

commit;
