-- Insert St. Louis Location-Specific Prompts (for existing table structure)
-- Run this after update_existing_prompts_table.sql

-- Forest Park prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the Art Museum', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw the Grand Basin', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw the trees in Forest Park', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw the walking paths', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw a swan in the water', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw the World''s Fair Pavilion', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw a jogger', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1),
('draw the Science Center', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'forest-park'), 1);

-- Gateway Arch prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the Arch from below', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch from the side', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch reflected in water', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch at sunset', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch with people around it', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch from the river', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch with clouds', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1),
('draw the Arch at night', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'gateway-arch'), 1);

-- Mississippi Riverfront prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the Mississippi River', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the riverboats', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the river from the Arch', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the river at sunset', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the Eads Bridge', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw a barge on the river', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the riverfront park', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1),
('draw the river with the city behind it', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'riverfront'), 1);

-- Tower Grove Park prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the Victorian pavilions', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the flower gardens', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the park paths', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the trees in Tower Grove', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the bandstand', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw a family picnic', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the park entrance', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1),
('draw the fountain', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'tower-grove-park'), 1);

-- Laclede's Landing prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the cobblestone streets', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the historic buildings', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the nightlife scene', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the riverfront from here', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw a horse-drawn carriage', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the old warehouses', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the street performers', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1),
('draw the cobblestone texture', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'lacledes-landing'), 1);

-- Soulard Market prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the market vendors', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the fresh produce', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the market crowds', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the market building', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw a farmer''s stand', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the market clock tower', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the market entrance', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1),
('draw the market on a Saturday morning', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'soulard-market'), 1);

-- Cathedral Basilica prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the cathedral dome', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral from the front', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral spires', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral at sunset', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral doors', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral steps', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral from the side', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1),
('draw the cathedral with people', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'cathedral-basilica'), 1);

-- City Museum prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the museum exterior', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum from the street', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum at night', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum with people', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum entrance', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum building', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum from the parking lot', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1),
('draw the museum with the Arch in background', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'city-museum'), 1);

-- Union Station prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the station building', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station from the front', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station at night', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station with people', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station clock tower', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station entrance', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station from the side', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1),
('draw the station with the Arch', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'union-station'), 1);

-- The Hill prompts
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
('draw the Italian restaurants', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the neighborhood streets', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the Hill at sunset', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the Hill with people', 'prompt', true, 'generative', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw a restaurant sign', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the neighborhood houses', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the Hill from the street', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1),
('draw the Hill with the Arch in background', 'prompt', true, 'subject', false, false, (SELECT id FROM locations WHERE slug = 'the-hill'), 1);
