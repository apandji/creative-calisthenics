-- Insert St. Louis Location-Specific Prompts
-- Run this after the main setup_driftpad_v2.sql

-- Forest Park prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the Art Museum', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw the Grand Basin', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw the trees in Forest Park', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw the walking paths', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw a swan in the water', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw the World''s Fair Pavilion', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw a jogger', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park')),
('draw the Science Center', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'forest-park'));

-- Gateway Arch prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the Arch from below', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch from the side', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch reflected in water', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch at sunset', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch with people around it', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch from the river', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch with clouds', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch')),
('draw the Arch at night', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'gateway-arch'));

-- Mississippi Riverfront prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the Mississippi River', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the riverboats', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the river from the Arch', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the river at sunset', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the Eads Bridge', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw a barge on the river', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the riverfront park', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront')),
('draw the river with the city behind it', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'riverfront'));

-- Tower Grove Park prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the Victorian pavilions', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the flower gardens', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the park paths', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the trees in Tower Grove', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the bandstand', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw a family picnic', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the park entrance', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park')),
('draw the fountain', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'tower-grove-park'));

-- Laclede's Landing prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the cobblestone streets', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the historic buildings', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the nightlife scene', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the riverfront from here', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw a horse-drawn carriage', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the old warehouses', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the street performers', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing')),
('draw the cobblestone texture', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'lacledes-landing'));

-- Soulard Market prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the market vendors', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the fresh produce', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the market crowds', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the market building', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw a farmer''s stand', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the market clock tower', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the market entrance', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market')),
('draw the market on a Saturday morning', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'soulard-market'));

-- Cathedral Basilica prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the cathedral dome', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral from the front', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral spires', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral at sunset', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral doors', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral steps', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral from the side', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica')),
('draw the cathedral with people', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'));

-- City Museum prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the museum exterior', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum from the street', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum at night', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum with people', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum entrance', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum building', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum from the parking lot', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum')),
('draw the museum with the Arch in background', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'city-museum'));

-- Union Station prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the station building', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station from the front', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station at night', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station with people', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station clock tower', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station entrance', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station from the side', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station')),
('draw the station with the Arch', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'union-station'));

-- The Hill prompts
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
('draw the Italian restaurants', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the neighborhood streets', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the Hill at sunset', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the Hill with people', 'generative', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw a restaurant sign', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the neighborhood houses', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the Hill from the street', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill')),
('draw the Hill with the Arch in background', 'subject', FALSE, FALSE, (SELECT id FROM locations WHERE slug = 'the-hill'));
