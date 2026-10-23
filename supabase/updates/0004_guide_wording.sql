-- Kitar update 0004: clearer guide wording.
-- Run in Supabase → SQL Editor AFTER seed.sql (it updates rows the seed created). Safe to run again.
--
-- 1. Items handed to the collector (e-waste, textiles, cooking oil) now say where to take them.
-- 2. E-waste steps match the app's flow (hand it to the collector, not a separate e-waste site).
-- 3. Every preparation step now has a Malay version (new column prep_steps_ms).
-- 4. Drink cartons go in the QR bag and the collector sorts them, instead of a blue-bin claim.

alter table public.waste_items
  add column if not exists prep_steps_ms text[] not null default '{}';

-- Cartons: no bin colour; they travel in the resident's QR bag.
update public.waste_categories set bin_colour = 'qr-bag' where id = 'carton';

update public.waste_items as w
set prep_steps = v.en, prep_steps_ms = v.ms
from (values
  -- Paper
  ('Newspaper',
    array['Keep it dry', 'Remove plastic wrapping', 'Stack and tie, or put in a paper bag'],
    array['Pastikan ia kering', 'Buang pembalut plastik', 'Susun dan ikat, atau masukkan ke dalam beg kertas']),
  ('Cardboard box',
    array['Remove tape and labels', 'Flatten the box', 'Keep it dry'],
    array['Tanggalkan pita pelekat dan label', 'Leperkan kotak', 'Pastikan ia kering']),
  ('Magazine or book',
    array['Remove plastic covers', 'Keep it dry'],
    array['Buang sampul plastik', 'Pastikan ia kering']),
  ('Envelope and office paper',
    array['Tear off plastic windows if it is easy', 'Shred only if the paper is confidential'],
    array['Koyakkan tingkap plastik jika mudah', 'Carikkan hanya jika kertas itu sulit']),
  ('Egg tray (paper)',
    array['Must be clean and dry'],
    array['Mesti bersih dan kering']),

  -- Plastic
  ('PET drink bottle',
    array['Empty and rinse', 'Squash it flat', 'Keep the cap on'],
    array['Kosongkan dan bilas', 'Pipihkan', 'Biarkan penutup terpasang']),
  ('Detergent or shampoo bottle',
    array['Empty and rinse', 'Keep the cap on'],
    array['Kosongkan dan bilas', 'Biarkan penutup terpasang']),
  ('Plastic milk jug',
    array['Empty and rinse', 'Squash it if you can'],
    array['Kosongkan dan bilas', 'Pipihkan jika boleh']),
  ('Clean plastic bag',
    array['Must be clean and dry', 'Stuff several bags into one bag'],
    array['Mesti bersih dan kering', 'Kumpulkan beberapa beg ke dalam satu beg']),
  ('Plastic food container (hard)',
    array['Scrape out the food', 'Rinse', 'Lids can go in too'],
    array['Kikis sisa makanan', 'Bilas', 'Penutup boleh dimasukkan sekali']),

  -- Metal
  ('Aluminium drink can',
    array['Empty and rinse', 'Squash it flat'],
    array['Kosongkan dan bilas', 'Pipihkan']),
  ('Food tin',
    array['Empty and rinse', 'Put the lid inside the tin'],
    array['Kosongkan dan bilas', 'Masukkan penutup ke dalam tin']),

  -- Glass
  ('Glass bottle',
    array['Empty and rinse', 'Remove the cap', 'Do not break it'],
    array['Kosongkan dan bilas', 'Tanggalkan penutup', 'Jangan pecahkan']),
  ('Glass jar',
    array['Empty and rinse', 'Remove the metal lid (the lid goes with metal)'],
    array['Kosongkan dan bilas', 'Tanggalkan penutup logam (penutup diasingkan bersama logam)']),

  -- Drink carton
  ('Drink carton (Tetra Pak)',
    array['Empty it and rinse quickly', 'Flatten it', 'Put the straw in general waste', 'Put it in your QR bag; the collector sorts cartons separately'],
    array['Kosongkan dan bilas sekejap', 'Leperkan', 'Buang straw ke dalam sampah am', 'Masukkan ke dalam beg QR anda; pengutip akan mengasingkan kotak minuman']),

  -- E-waste (handed to the collector)
  ('Mobile phone',
    array['Back up and wipe your data', 'Remove the SIM and memory card', 'Bring it to your township recycling point and hand it to the collector (keep it out of your QR bag)'],
    array['Sandarkan dan padam data anda', 'Keluarkan kad SIM dan kad memori', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Laptop or tablet',
    array['Back up and wipe your data', 'Bring it to your township recycling point and hand it to the collector (keep it out of your QR bag)'],
    array['Sandarkan dan padam data anda', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Remote, keyboard or mouse',
    array['Take the batteries out (they are handed in separately)', 'Bring it to your township recycling point and hand it to the collector (keep it out of your QR bag)'],
    array['Keluarkan bateri (bateri diserahkan secara berasingan)', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Used batteries',
    array['Tape the ends of lithium batteries', 'Never put them in the general bin', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Tampal hujung bateri litium dengan pita', 'Jangan sekali-kali buang ke dalam tong sampah am', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Charger and cables',
    array['Bundle the cables together', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Ikat kabel bersama-sama', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),

  -- Textile (handed to the collector)
  ('Clothes',
    array['Wash and dry', 'Pack them in a bag', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Basuh dan keringkan', 'Masukkan ke dalam beg', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Jeans and trousers',
    array['Wash and dry', 'Pack them in a bag', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Basuh dan keringkan', 'Masukkan ke dalam beg', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Shoes',
    array['Tie each pair together', 'Clean off mud', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Ikat setiap pasang bersama', 'Bersihkan lumpur', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),
  ('Bags',
    array['Empty all the pockets', 'Bring them to your township recycling point and hand them to the collector (keep them out of your QR bag)'],
    array['Kosongkan semua poket', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),

  -- Cooking oil (handed to the collector)
  ('Used cooking oil',
    array['Let it cool', 'Strain out food bits', 'Pour it into a plastic bottle and close it tightly', 'Bring it to your township recycling point and hand it to the collector (keep it out of your QR bag)'],
    array['Biarkan sejuk', 'Tapis sisa makanan', 'Tuang ke dalam botol plastik dan tutup rapat', 'Bawa ke pusat kitar semula taman anda dan serahkan kepada pengutip (jangan masukkan ke dalam beg QR)']),

  -- Not recyclable through Kitar
  ('Polystyrene food box',
    array['Not accepted: put it in general waste', 'Better: bring your own container when you tapau'],
    array['Tidak diterima: buang ke dalam sampah am', 'Lebih baik: bawa bekas sendiri semasa tapau']),
  ('Used tissue',
    array['Not accepted: put it in general waste'],
    array['Tidak diterima: buang ke dalam sampah am']),
  ('Food waste',
    array['Not accepted in Kitar bags', 'Compost it if your township has a compost point'],
    array['Tidak diterima dalam beg Kitar', 'Jadikan kompos jika taman anda ada tempat kompos']),
  ('Disposable diaper',
    array['Not accepted: put it in general waste'],
    array['Tidak diterima: buang ke dalam sampah am']),
  ('Greasy pizza box',
    array['Greasy parts go in general waste', 'Clean, dry parts can go with paper'],
    array['Bahagian yang berminyak dibuang ke dalam sampah am', 'Bahagian yang bersih dan kering boleh diasingkan bersama kertas']),
  ('Plastic straw and cutlery',
    array['Too small to sort: put it in general waste', 'Better: say no to straws and plastic cutlery'],
    array['Terlalu kecil untuk diasingkan: buang ke dalam sampah am', 'Lebih baik: tolak straw dan sudu garpu plastik'])
) as v (name_en, en, ms)
where w.name_en = v.name_en;
