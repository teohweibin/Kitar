-- Kitar update 0006: password-free demo sessions for judges.
-- Before running: Supabase → Authentication → Sign In / Providers → turn on
-- "Allow anonymous sign-ins". Then run this in the SQL Editor (safe to run again).
--
-- The login page's "Try as …" buttons sign the visitor in anonymously, then call
-- start_demo_session(role) to give that anonymous user a demo profile:
--   resident  → shares unit SAMPLE-A-0101 (so the judge sees real-looking history)
--   collector → can record collections as themselves (RLS rules unchanged)
--   admin     → read-only dashboard
-- Only anonymous users can use it, so it can never change a real or seeded account.

create or replace function public.start_demo_session(p_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in first';
  end if;
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true then
    raise exception 'Demo roles are only for anonymous demo sessions';
  end if;
  if p_role not in ('resident', 'collector', 'admin') then
    raise exception 'Unknown demo role: %', p_role;
  end if;

  insert into public.profiles (id, role, unit_id, display_name)
  values (
    auth.uid(),
    p_role,
    case when p_role = 'resident' then (select id from public.units where unit_code = 'SAMPLE-A-0101') end,
    'Demo ' || p_role
  )
  on conflict (id) do update
    set role = excluded.role, unit_id = excluded.unit_id, display_name = excluded.display_name;
end
$$;

revoke execute on function public.start_demo_session(text) from public, anon;
grant execute on function public.start_demo_session(text) to authenticated;
