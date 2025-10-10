-- Add gallery-based prompts for Driftpad v2
-- These prompts will load actual drawings from the community

-- Insert "erase" prompts (requires_gallery_image = true, category = 'erase')
INSERT INTO prompts (content, category, requires_shape, requires_gallery_image, type, active, weight) VALUES
('erase this drawing and create something new', 'erase', FALSE, TRUE, 'prompt', TRUE, 3),
('wipe this away and start fresh', 'erase', FALSE, TRUE, 'prompt', TRUE, 2),
('erase everything and draw your own version', 'erase', FALSE, TRUE, 'prompt', TRUE, 2),
('clear this and make it yours', 'erase', FALSE, TRUE, 'prompt', TRUE, 1),
('erase and recreate in your style', 'erase', FALSE, TRUE, 'prompt', TRUE, 2);

-- Insert "add to drawing" prompts (requires_gallery_image = true, category = 'add_to_drawing')
INSERT INTO prompts (content, category, requires_shape, requires_gallery_image, type, active, weight) VALUES
('add to this drawing', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 3),
('continue this artwork', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 2),
('build upon this drawing', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 2),
('add your own elements to this', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 1),
('extend this drawing with your creativity', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 2),
('collaborate with this artwork', 'add_to_drawing', FALSE, TRUE, 'prompt', TRUE, 1);

-- Note: Make sure you have some drawings in your database with:
-- - is_public = TRUE
-- - is_erase_eligible = TRUE (for erase prompts)
-- - is_add_eligible = TRUE (for add_to_drawing prompts)
-- - image_url pointing to the actual image file
