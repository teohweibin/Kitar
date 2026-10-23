-- Kitar seed: fictional sample data only.
-- Run in Supabase → SQL Editor AFTER 0001–0003 and AFTER creating the four demo users
-- in Authentication → Users (resident1@demo.test, resident2@demo.test,
-- collector1@demo.test, admin@demo.test). Safe to run again: existing rows are kept.

do $$
declare
  missing text;
begin
  select string_agg(e, ', ') into missing
  from unnest(array['resident1@demo.test', 'resident2@demo.test', 'collector1@demo.test', 'admin@demo.test']) as e
  where not exists (select 1 from auth.users u where u.email = e);
  if missing is not null then
    raise exception 'Create these demo users in Authentication → Users first: %', missing;
  end if;
end $$;

-- Townships (fictional)
insert into public.townships (name, is_sample) values
  ('Taman Sample Hijau', true),
  ('Taman Sample Damai', true),
  ('Taman Sample Indah', true)
on conflict (name) do nothing;

-- 10 units per township: SAMPLE-A-0101 … SAMPLE-A-0502 (A = Hijau, B = Damai, C = Indah)
insert into public.units (township_id, unit_code)
select t.id, format('SAMPLE-%s-%s%s', l.letter, lpad(f::text, 2, '0'), lpad(n::text, 2, '0'))
from (values ('Taman Sample Hijau', 'A'), ('Taman Sample Damai', 'B'), ('Taman Sample Indah', 'C')) as l (tname, letter)
join public.townships t on t.name = l.tname
cross join generate_series(1, 5) as f
cross join generate_series(1, 2) as n
on conflict (unit_code) do nothing;

-- Categories. points_per_kg are sample values for the prototype, not a real offer.
-- co2e_kg_per_kg / co2e_source stay empty until filled with a cited factor.
insert into public.waste_categories (id, name_en, name_ms, bin_colour, points_per_kg, sort_order) values
  ('paper',       'Paper',            'Kertas',               'blue',     5,  1),
  ('plastic',     'Plastic',          'Plastik',              'orange',   10, 2),
  ('metal',       'Metal',            'Logam',                'orange',   15, 3),
  ('glass',       'Glass',            'Kaca',                 'brown',    5,  4),
  ('carton',      'Drink carton',     'Kotak minuman',        'blue',     10, 5),
  ('ewaste',      'E-waste',          'E-sisa',               'drop-off', 20, 6),
  ('textile',     'Textile',          'Tekstil',              'drop-off', 8,  7),
  ('cooking_oil', 'Used cooking oil', 'Minyak masak terpakai','drop-off', 15, 8)
on conflict (id) do nothing;

-- Sorting guide (sample). model_labels are ImageNet class names returned by MobileNet.
insert into public.waste_items (name_en, name_ms, category_id, prep_steps, keywords, model_labels) values
  -- Paper
  ('Newspaper', 'Surat khabar', 'paper',
    array['Keep it dry', 'Remove plastic wrapping', 'Stack and tie or put in a paper bag'],
    array['news', 'akhbar', 'paper'], array['crossword puzzle', 'menu']),
  ('Cardboard box', 'Kotak kadbod', 'paper',
    array['Remove tape and labels', 'Flatten the box', 'Keep it dry'],
    array['kadbod', 'box', 'kotak', 'parcel', 'shopee', 'lazada'], array['carton']),
  ('Magazine or book', 'Majalah atau buku', 'paper',
    array['Remove plastic covers', 'Keep it dry'],
    array['majalah', 'buku', 'book'], array['comic book', 'book jacket']),
  ('Envelope and office paper', 'Sampul surat dan kertas pejabat', 'paper',
    array['Remove plastic windows if easy', 'Shred only if confidential'],
    array['envelope', 'sampul', 'kertas a4', 'office'], array['envelope']),
  ('Egg tray (paper)', 'Bekas telur (kertas)', 'paper',
    array['Must be clean and dry'],
    array['telur', 'egg'], array[]::text[]),

  -- Plastic
  ('PET drink bottle', 'Botol minuman plastik PET', 'plastic',
    array['Empty and rinse', 'Squash flat', 'Keep the cap on'],
    array['botol', 'bottle', 'mineral', 'air', 'soda', 'pet'], array['water bottle', 'pop bottle']),
  ('Detergent or shampoo bottle', 'Botol detergen atau syampu', 'plastic',
    array['Empty and rinse', 'Keep the cap on'],
    array['botol', 'syampu', 'shampoo', 'sabun', 'detergent'], array['lotion', 'soap dispenser']),
  ('Plastic milk jug', 'Jag susu plastik', 'plastic',
    array['Empty and rinse', 'Squash if possible'],
    array['susu', 'milk', 'jug', 'botol'], array['water jug']),
  ('Clean plastic bag', 'Beg plastik bersih', 'plastic',
    array['Must be clean and dry', 'Bundle several bags inside one bag'],
    array['beg', 'bag', 'plastik'], array['plastic bag']),
  ('Plastic food container (hard)', 'Bekas makanan plastik (keras)', 'plastic',
    array['Scrape out food', 'Rinse', 'Lids can go in too'],
    array['bekas', 'container', 'tupperware', 'tapau'], array[]::text[]),

  -- Metal
  ('Aluminium drink can', 'Tin minuman aluminium', 'metal',
    array['Empty and rinse', 'Squash flat'],
    array['tin', 'can', 'aluminium', 'soda', 'minuman'], array[]::text[]),
  ('Food tin', 'Tin makanan', 'metal',
    array['Empty and rinse', 'Put the lid inside the tin'],
    array['tin', 'sardin', 'can', 'kaleng'], array['milk can']),

  -- Glass
  ('Glass bottle', 'Botol kaca', 'glass',
    array['Empty and rinse', 'Remove the cap', 'Do not break it'],
    array['botol', 'kaca', 'glass', 'bottle', 'kicap', 'sos'], array['wine bottle', 'beer bottle', 'whiskey jug']),
  ('Glass jar', 'Balang kaca', 'glass',
    array['Empty and rinse', 'Remove the metal lid (lid goes with metal)'],
    array['balang', 'jar', 'kaca', 'jem'], array[]::text[]),

  -- Drink carton
  ('Drink carton (Tetra Pak)', 'Kotak air minuman (Tetra Pak)', 'carton',
    array['Empty it', 'Rinse quickly', 'Flatten', 'Straw goes in general waste'],
    array['kotak', 'tetra pak', 'susu', 'jus', 'juice', 'milk', 'carton', 'teh', 'kopi'], array['carton', 'packet', 'milk can']),

  -- E-waste
  ('Mobile phone', 'Telefon bimbit', 'ewaste',
    array['Back up and wipe your data', 'Remove the SIM and memory card', 'Bring to the e-waste drop-off'],
    array['phone', 'telefon', 'handphone', 'hp', 'smartphone'], array['cellular telephone', 'ipod', 'hand-held computer']),
  ('Laptop or tablet', 'Komputer riba atau tablet', 'ewaste',
    array['Back up and wipe your data', 'Bring to the e-waste drop-off'],
    array['laptop', 'komputer', 'tablet', 'ipad'], array['laptop', 'notebook']),
  ('Remote, keyboard or mouse', 'Alat kawalan jauh, papan kekunci atau tetikus', 'ewaste',
    array['Remove batteries (they go separately)', 'Bring to the e-waste drop-off'],
    array['remote', 'keyboard', 'mouse', 'tetikus'], array['remote control', 'computer keyboard', 'mouse']),
  ('Used batteries', 'Bateri terpakai', 'ewaste',
    array['Tape the ends of lithium batteries', 'Never put them in the general bin'],
    array['bateri', 'battery', 'aa', 'aaa'], array[]::text[]),
  ('Charger and cables', 'Pengecas dan kabel', 'ewaste',
    array['Bundle cables together', 'Bring to the e-waste drop-off'],
    array['charger', 'pengecas', 'kabel', 'cable', 'wire'], array[]::text[]),

  -- Textile
  ('Clothes', 'Pakaian', 'textile',
    array['Wash and dry', 'Pack in a bag'],
    array['baju', 'shirt', 'clothes', 'pakaian', 'kain'], array['jersey', 'sweatshirt', 'cardigan']),
  ('Jeans and trousers', 'Seluar jeans dan seluar', 'textile',
    array['Wash and dry', 'Pack in a bag'],
    array['seluar', 'jeans', 'pants'], array['jean']),
  ('Shoes', 'Kasut', 'textile',
    array['Tie pairs together', 'Clean off mud'],
    array['kasut', 'shoes', 'sneakers', 'selipar'], array['running shoe', 'sandal', 'loafer']),
  ('Bags', 'Beg', 'textile',
    array['Empty all pockets'],
    array['beg', 'bag', 'backpack'], array['backpack', 'purse']),

  -- Cooking oil
  ('Used cooking oil', 'Minyak masak terpakai', 'cooking_oil',
    array['Let it cool', 'Strain out food bits', 'Pour into a sealed plastic bottle'],
    array['minyak', 'oil', 'masak', 'goreng'], array[]::text[]),

  -- Not recyclable through Kitar (category_id null)
  ('Polystyrene food box', 'Bekas polistirena', null,
    array['Not accepted: put it in general waste', 'Better: bring your own container when you tapau'],
    array['polystyrene', 'polistirena', 'styrofoam', 'tapau', 'bekas'], array[]::text[]),
  ('Used tissue', 'Tisu terpakai', null,
    array['Not accepted: put it in general waste'],
    array['tisu', 'tissue', 'napkin'], array['toilet tissue', 'paper towel']),
  ('Food waste', 'Sisa makanan', null,
    array['Not accepted in Kitar bags', 'Compost it if your township has a compost point'],
    array['makanan', 'food', 'sisa', 'nasi'], array['pizza']),
  ('Disposable diaper', 'Lampin pakai buang', null,
    array['Not accepted: put it in general waste'],
    array['lampin', 'diaper', 'pampers'], array['diaper']),
  ('Greasy pizza box', 'Kotak piza berminyak', null,
    array['Greasy parts go in general waste', 'Clean, dry parts can go with paper'],
    array['piza', 'pizza', 'kotak'], array[]::text[]),
  ('Plastic straw and cutlery', 'Straw dan sudu plastik', null,
    array['Too small to sort: put it in general waste', 'Better: say no straw'],
    array['straw', 'sudu', 'garfu', 'cutlery'], array[]::text[])
on conflict (name_en) do nothing;

-- Demo profiles, linked to the demo users by email.
insert into public.profiles (id, role, unit_id, display_name)
select u.id, p.role, un.id, p.display_name
from (values
  ('resident1@demo.test',  'resident',  'SAMPLE-A-0101', 'Sample Resident A'),
  ('resident2@demo.test',  'resident',  'SAMPLE-B-0101', 'Sample Resident B'),
  ('collector1@demo.test', 'collector', null,            'Sample Collector 1'),
  ('admin@demo.test',      'admin',     null,            'Sample Admin')
) as p (email, role, unit_code, display_name)
join auth.users u on u.email = p.email
left join public.units un on un.unit_code = p.unit_code
on conflict (id) do update
  set role = excluded.role, unit_id = excluded.unit_id, display_name = excluded.display_name;

-- About 3 months of weekly Saturday collections. Townships take part at different rates
-- so the leaderboard has a clear order. Only runs when collections is empty.
-- The random draws live in LATERAL subqueries that reference the outer row: a bare
-- random() in WHERE can be evaluated once per input table by the planner, which gave
-- every unit the same yes/no and every category the same yes/no.
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
where not exists (select 1 from public.collections)
  -- does this unit take part this week? A ≈ 80 %, B ≈ 60 %, C ≈ 40 %
  and wk.takes_part < case
    when un.unit_code like 'SAMPLE-A-%' then 0.8
    when un.unit_code like 'SAMPLE-B-%' then 0.6
    else 0.4
  end
  -- and does it bring this category that week?
  and item.brings < cat.chance;
