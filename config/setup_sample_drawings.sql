-- Set up sample drawings for gallery testing
-- This script adds some test drawings that can be used for erase/add prompts

-- First, let's update any existing drawings to be gallery eligible
UPDATE drawings 
SET is_public = TRUE,
    is_erase_eligible = TRUE,
    is_add_eligible = TRUE,
    title = 'Community Drawing',
    description = 'Shared creative work'
WHERE is_public IS NULL OR is_public = FALSE;

-- If you don't have any drawings yet, you can insert some sample ones
-- (Replace the image_url with actual URLs to your drawing images)
INSERT INTO drawings (image_url, title, description, is_public, is_erase_eligible, is_add_eligible, created_at) VALUES
('https://example.com/drawing1.jpg', 'Abstract Flow', 'A flowing abstract composition', TRUE, TRUE, TRUE, NOW()),
('https://example.com/drawing2.jpg', 'Geometric Study', 'Geometric shapes and patterns', TRUE, TRUE, TRUE, NOW()),
('https://example.com/drawing3.jpg', 'Nature Sketch', 'A simple nature drawing', TRUE, TRUE, TRUE, NOW()),
('https://example.com/drawing4.jpg', 'Portrait Study', 'A character portrait', TRUE, TRUE, TRUE, NOW()),
('https://example.com/drawing5.jpg', 'Cityscape', 'Urban landscape drawing', TRUE, TRUE, TRUE, NOW())
ON CONFLICT DO NOTHING;

-- Note: Replace the example URLs with actual image URLs from your storage
-- You can use Supabase Storage, AWS S3, or any other image hosting service
