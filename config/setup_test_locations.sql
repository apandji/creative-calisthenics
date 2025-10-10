-- Setup test locations for Driftpad v2
-- Run this in your Supabase SQL editor

-- Insert St. Louis test locations
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state) VALUES
('Forest Park', 'forest-park', 38.6386, -90.2847, 800, 'St. Louis', 'MO'),
('Gateway Arch', 'gateway-arch', 38.6247, -90.1847, 300, 'St. Louis', 'MO'),
('Mississippi Riverfront', 'riverfront', 38.6250, -90.1800, 500, 'St. Louis', 'MO'),
('Tower Grove Park', 'tower-grove-park', 38.6100, -90.2600, 600, 'St. Louis', 'MO'),
('Laclede''s Landing', 'lacledes-landing', 38.6300, -90.1900, 400, 'St. Louis', 'MO'),
('Soulard Market', 'soulard-market', 38.6000, -90.2200, 300, 'St. Louis', 'MO'),
('Cathedral Basilica', 'cathedral-basilica', 38.6400, -90.2500, 200, 'St. Louis', 'MO'),
('City Museum', 'city-museum', 38.6350, -90.2000, 250, 'St. Louis', 'MO'),
('Union Station', 'union-station', 38.6250, -90.2100, 300, 'St. Louis', 'MO'),
('The Hill', 'the-hill', 38.6000, -90.2400, 400, 'St. Louis', 'MO')
ON CONFLICT (slug) DO NOTHING;

-- Add some location-specific prompts for Forest Park
INSERT INTO prompts (content, category, requires_shape, requires_gallery_image, location_id, active, weight) VALUES
('draw the trees around you', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 5),
('draw the path you''re walking on', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 4),
('draw the sky above the park', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 3),
('draw something you see in nature', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 5),
('draw the feeling of being outdoors', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 4),
('draw a bird you might see here', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 3),
('draw a tree in your own style', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 4),
('draw the park bench you''re sitting on', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'), TRUE, 3);

-- Add some location-specific prompts for Gateway Arch
INSERT INTO prompts (content, category, requires_shape, requires_gallery_image, location_id, active, weight) VALUES
('draw the arch from your perspective', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 5),
('draw the river flowing below', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 4),
('draw the city skyline', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 4),
('draw the arch as a symbol of journey', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 3),
('draw the people around you', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 3),
('draw the arch from memory', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'), TRUE, 4);
