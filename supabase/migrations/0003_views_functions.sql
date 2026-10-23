-- Kitar 0003: points view and leaderboard function.
-- Run after 0002.

-- Points per unit. security_invoker makes the view obey the caller's RLS on collections,
-- so a resident only ever gets their own unit's row.
create or replace view public.unit_points
with (security_invoker = true)
as
select
  c.unit_id,
  round(sum(c.weight_kg), 2) as total_kg,
  round(sum(c.weight_kg * wc.points_per_kg))::integer as points,
  count(*)::integer as collections
from public.collections c
join public.waste_categories wc on wc.id = c.category_id
group by c.unit_id;

grant select on public.unit_points to authenticated;

-- Township leaderboard for one calendar month. Runs as definer so residents can rank
-- townships, but it returns township totals only: no unit ids, codes or names.
create or replace function public.get_township_leaderboard(
  p_month date default (date_trunc('month', now()))::date
)
returns table (
  township_id uuid,
  township_name text,
  total_kg numeric,
  participating_units integer,
  total_units integer,
  kg_per_participating_unit numeric,
  participation_pct numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with month_collections as (
    select c.unit_id, c.weight_kg
    from public.collections c
    where c.collected_at >= date_trunc('month', p_month)
      and c.collected_at < date_trunc('month', p_month) + interval '1 month'
  ),
  per_township as (
    select
      t.id as tid,
      t.name as tname,
      coalesce(sum(mc.weight_kg), 0) as kg,
      count(distinct mc.unit_id) as active_units,
      (select count(*) from public.units u2 where u2.township_id = t.id) as unit_count
    from public.townships t
    left join public.units u on u.township_id = t.id
    left join month_collections mc on mc.unit_id = u.id
    group by t.id, t.name
  )
  select
    tid,
    tname,
    round(kg, 2),
    active_units::integer,
    unit_count::integer,
    case when active_units > 0 then round(kg / active_units, 2) else 0 end,
    case when unit_count > 0 then round(100.0 * active_units / unit_count, 1) else 0 end
  from per_township
  order by 6 desc, 3 desc
$$;

revoke execute on function public.get_township_leaderboard(date) from public, anon;
grant execute on function public.get_township_leaderboard(date) to authenticated;
