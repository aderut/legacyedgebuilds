-- Run this AFTER cms.sql, in the Supabase SQL editor.
-- Seeds the products, gallery_items, and blog_posts tables with the
-- placeholder content already on the site, so nothing goes blank once the
-- site switches from static files to the database.
--
-- Safe to run more than once for products and blog_posts (they skip rows
-- that already exist by slug). gallery_items has no unique key, so running
-- this twice will duplicate gallery photos — if you need to reset gallery
-- content, delete the duplicates from /admin/gallery or truncate the table
-- first: `truncate gallery_items;`

insert into products (slug, name, category, image, description, features, colors, sizes, applications) values
('vinyl-flooring', 'Vinyl Flooring', 'Flooring', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200',
 'Waterproof, low-maintenance vinyl flooring engineered for Nigerian homes and offices — realistic wood and stone finishes without the upkeep.',
 ARRAY['100% waterproof','Scratch resistant wear layer','Easy click-lock installation','Sound-dampening underlayer'],
 ARRAY['Oak Grey','Walnut Brown','Ash Blonde','Charcoal Slate'],
 ARRAY['180mm x 1220mm planks','2mm–5mm thickness'],
 ARRAY['Living rooms','Bedrooms','Offices','Retail spaces']),

('spc-flooring', 'SPC Flooring', 'Flooring', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200',
 'Stone Plastic Composite flooring built for high-traffic spaces — rigid, dent-resistant, and stable in Nigeria''s heat and humidity.',
 ARRAY['Rigid stone-composite core','Dent and heat resistant','Zero expansion in humidity','Fire retardant'],
 ARRAY['Natural Oak','Grey Concrete','Espresso'],
 ARRAY['180mm x 1220mm planks','4mm–6mm thickness'],
 ARRAY['Hotels','Offices','Kitchens','Commercial spaces']),

('wpc-wall-panels', 'WPC Wall Panels', 'Wall Solutions', 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200',
 'Wood-Plastic Composite wall panels that deliver the warmth of timber with none of the termite or moisture risk.',
 ARRAY['Moisture and termite proof','Tool-free click installation','Built-in cable channels','Low VOC'],
 ARRAY['Teak','Natural Wood','Grey Oak'],
 ARRAY['600mm x 2900mm','10mm–18mm thickness'],
 ARRAY['Living rooms','Offices','Reception areas']),

('pvc-uv-marble-sheets', 'PVC UV Marble Sheets', 'Wall Solutions', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200',
 'High-gloss UV-coated marble-effect sheets that give the look of natural marble at a fraction of the weight and cost.',
 ARRAY['Scratch and stain resistant UV coating','Lightweight — no structural reinforcement needed','Seamless large-format panels'],
 ARRAY['Calacatta White','Emperador Brown','Black Galaxy'],
 ARRAY['1220mm x 2440mm sheets','3mm–6mm thickness'],
 ARRAY['Kitchens','Bathrooms','Feature walls','Reception counters']),

('3d-wall-panels', '3D Wall Panels', 'Wall Solutions', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200',
 'Sculptural textured panels that add depth and shadow-play to feature walls in homes and hospitality spaces.',
 ARRAY['Paintable surface','Lightweight gypsum/PU composite','Modular tile-based install'],
 ARRAY['Matte White (paintable)','Charcoal','Gold-flecked'],
 ARRAY['500mm x 500mm tiles','600mm x 600mm tiles'],
 ARRAY['Feature walls','Hotel lobbies','Bedrooms']),

('fluted-panels', 'Fluted Panels', 'Wall Solutions', 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?q=80&w=1200',
 'Vertical fluted profiles for the ribbed, boutique-hotel look that''s become a signature of modern Nigerian interiors.',
 ARRAY['Consistent groove profile','Wood or matte-finish veneer','Simple batten-mounted install'],
 ARRAY['Natural Oak','Walnut','Matte Black'],
 ARRAY['150mm x 2900mm slats'],
 ARRAY['Living rooms','Offices','TV feature walls']),

('mdf-boards', 'MDF Boards', 'Boards', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200',
 'Medium-density fibreboard with a smooth, uniform surface — the standard base material for cabinetry and joinery.',
 ARRAY['Smooth uniform surface','Consistent density, no knots','Easy to cut, rout, and veneer'],
 ARRAY['Natural (unfinished)'],
 ARRAY['1220mm x 2440mm','12mm–25mm thickness'],
 ARRAY['Cabinetry','Wardrobes','Furniture']),

('hdf-boards', 'HDF Boards', 'Boards', 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?q=80&w=1200',
 'High-density fibreboard offering greater strength and moisture resistance than standard MDF for demanding applications.',
 ARRAY['Higher density than MDF','Improved moisture resistance','Strong screw-holding capacity'],
 ARRAY['Natural (unfinished)'],
 ARRAY['1220mm x 2440mm','3mm–8mm thickness'],
 ARRAY['Cabinet backs','Drawer bottoms','Doors']),

('marine-boards', 'Marine Boards', 'Boards', 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=1200',
 'Waterproof plywood built with phenolic-bonded veneers, engineered for constant exposure to water and humidity.',
 ARRAY['Phenolic bonded — fully waterproof','Boil-proof (BWP) grade','Termite and borer resistant'],
 ARRAY['Natural (unfinished)'],
 ARRAY['1220mm x 2440mm','12mm–19mm thickness'],
 ARRAY['Kitchens','Bathrooms','Outdoor-adjacent furniture']),

('blockboards', 'Blockboards', 'Boards', 'https://images.unsplash.com/photo-1616627988516-d29d1d1de1a1?q=80&w=1200',
 'Solid wood-core boards known for exceptional strength and screw-holding — ideal for load-bearing furniture.',
 ARRAY['Solid timber core strips','Excellent screw and nail holding','Lightweight relative to plywood'],
 ARRAY['Natural (unfinished)'],
 ARRAY['1220mm x 2440mm','16mm–25mm thickness'],
 ARRAY['Wardrobes','Shelving','Doors']),

('hinges', 'Hinges', 'Furniture Accessories', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
 'Soft-close and standard cabinet hinges built for daily use in wardrobes, kitchen units, and cabinetry.',
 ARRAY['Soft-close damper option','105° and 165° opening angles','Corrosion-resistant plating'],
 ARRAY['Nickel','Matte Black','Gold'],
 ARRAY['26mm and 35mm cup sizes'],
 ARRAY['Kitchen cabinets','Wardrobes','Cabinetry']),

('drawer-runners', 'Drawer Runners', 'Furniture Accessories', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200',
 'Smooth-glide telescopic runners for drawers that need to handle daily wear without sagging.',
 ARRAY['Soft-close and push-to-open options','Full extension telescopic slide','Rated up to 35kg load'],
 ARRAY['Zinc/Silver'],
 ARRAY['300mm–600mm lengths'],
 ARRAY['Kitchen drawers','Office furniture','Wardrobes']),

('handles', 'Handles', 'Furniture Accessories', 'https://images.unsplash.com/photo-1616486338815-4e4d2a4b9d84?q=80&w=1200',
 'Cabinet and drawer handles in finishes that match the black-and-gold, brushed-brass aesthetic clients are asking for right now.',
 ARRAY['Solid metal construction','Standard and custom bore spacing','Tarnish-resistant finish'],
 ARRAY['Brushed Gold','Matte Black','Brushed Nickel'],
 ARRAY['96mm, 128mm, 160mm, 192mm centers'],
 ARRAY['Kitchens','Wardrobes','Furniture']),

('locks', 'Locks', 'Furniture Accessories', 'https://images.unsplash.com/photo-1622479999726-27e6a20ed8f8?q=80&w=1200',
 'Cabinet and drawer locks for secure storage in offices, hotel joinery, and residential cabinetry.',
 ARRAY['Keyed and combination options','Compact cam-lock design','Corrosion-resistant body'],
 ARRAY['Nickel','Matte Black'],
 ARRAY['Standard 16mm–20mm cylinder'],
 ARRAY['Office furniture','Wardrobes','Cabinetry'])
on conflict (slug) do nothing;

insert into gallery_items (title, category, image) values
('Living Room — SPC Flooring', 'Flooring', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200'),
('Feature Wall — Fluted Panels', 'Wall Panels', 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?q=80&w=1200'),
('Kitchen — PVC Marble Backsplash', 'Marble Sheets', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200'),
('Kitchen — Brushed Gold Hardware', 'Furniture Accessories', 'https://images.unsplash.com/photo-1616486338815-4e4d2a4b9d84?q=80&w=1200'),
('Wardrobe — MDF Cabinetry', 'Boards', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200'),
('Reception — WPC Panels', 'Wall Panels', 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200'),
('Bedroom — Vinyl Flooring', 'Flooring', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200'),
('Hotel Lobby — 3D Panels', 'Wall Panels', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200'),
('Bathroom Vanity — Marine Board', 'Boards', 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=1200');

insert into blog_posts (slug, title, excerpt, image, date, content) values
('best-flooring-for-nigerian-homes', 'Best Flooring for Nigerian Homes',
 'Heat, humidity, and heavy foot traffic all shape which flooring actually holds up in Nigerian homes. Here''s what to consider before you choose.',
 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200', '2026-05-12',
 ARRAY[
 'Nigerian homes deal with a combination of humidity, dust, and constant foot traffic that many imported flooring products aren''t built for. The right choice depends less on looks and more on how a material behaves in real conditions.',
 'SPC flooring has become a favourite for high-traffic areas because its stone-composite core doesn''t expand or warp in humidity the way solid wood can. Vinyl flooring is a strong second choice for bedrooms and living rooms where the priority is comfort underfoot and easy cleaning.',
 'Whichever you choose, always ask for the wear-layer thickness and check that the product carries a moisture warranty suited to tropical climates before it goes into your cart.'
 ]),

('pvc-marble-vs-traditional-marble', 'PVC Marble vs Traditional Marble',
 'PVC marble sheets deliver the look of natural stone at a fraction of the weight, cost, and installation time. Here''s how the two really compare.',
 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200', '2026-05-20',
 ARRAY[
 'Traditional marble is prized for its uniqueness — no two slabs are alike — but it comes with real costs: heavy structural loading, porous surfaces that stain, and lengthy, specialist installation.',
 'PVC UV marble sheets replicate the visual depth of natural stone using a printed and UV-coated surface bonded to a lightweight PVC core. The result is scratch- and stain-resistant, far lighter to transport and install, and consistent from sheet to sheet.',
 'For feature walls, kitchen backsplashes, and reception counters where visual impact matters more than geological authenticity, PVC marble is usually the more practical choice.'
 ]),

('how-to-choose-wpc-wall-panels', 'How to Choose WPC Wall Panels',
 'Wood-Plastic Composite panels vary widely in density, finish, and installation method. Here''s what actually matters when comparing options.',
 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200', '2026-06-02',
 ARRAY[
 'Not all WPC wall panels are built the same. Density of the composite core determines how well a panel resists dents and holds screws for shelving or TV mounts.',
 'Look for panels with a genuine click-lock tongue-and-groove edge — this affects both the speed of installation and how invisible the seams are once fitted.',
 'Finish matters too: a real wood-grain embossed texture reads very differently under lighting than a flat printed surface, especially in feature-wall applications.'
 ]),

('mdf-vs-marine-board', 'MDF vs Marine Board',
 'Choosing between MDF and marine board comes down to one question: will this piece ever be exposed to water?',
 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200', '2026-06-15',
 ARRAY[
 'MDF is smooth, consistent, and affordable — an excellent base for painted or veneered cabinetry that stays in dry rooms.',
 'Marine board is a phenolic-bonded plywood built to survive constant moisture exposure, making it the right call for kitchens, bathrooms, and any furniture near water.',
 'Using MDF in a wet area or over-specifying marine board for a dry bedroom wardrobe both waste money — match the board to the room.'
 ]),

('interior-design-trends-in-nigeria', 'Interior Design Trends in Nigeria',
 'From fluted panels to black-and-gold accents, here''s what''s shaping residential and commercial interiors across Nigeria right now.',
 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1200', '2026-06-28',
 ARRAY[
 'Fluted and 3D textured panels continue to move from hospitality projects into residential feature walls, driven by demand for a boutique-hotel feel at home.',
 'Black-and-gold material pairings — matte black cabinetry with brushed-gold hardware — remain the most requested combination in kitchens and living spaces.',
 'SPC flooring is increasingly the default recommendation for new builds, replacing ceramic tile in living areas thanks to its warmth underfoot and faster installation.'
 ])
on conflict (slug) do nothing;
