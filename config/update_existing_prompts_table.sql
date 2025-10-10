-- Update existing prompts table for Driftpad v2
-- This extends your current table structure instead of replacing it

-- Add new columns to existing prompts table
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS location_id UUID,
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS requires_shape BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_gallery_image BOOLEAN DEFAULT FALSE;

-- Create locations table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 500,
  city VARCHAR(50) DEFAULT 'St. Louis',
  state VARCHAR(50) DEFAULT 'MO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Note: We'll use the existing drawings table for gallery functionality
-- See update_drawings_table_for_gallery.sql for the safe update

-- Create user_sessions table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  last_prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_generic ON prompts(category, active) WHERE location_id IS NULL AND active = TRUE;
CREATE INDEX IF NOT EXISTS idx_prompts_location ON prompts(location_id, category, active) WHERE location_id IS NOT NULL AND active = TRUE;
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug) WHERE is_active = TRUE;
-- Gallery indexes will be added in the drawings table update
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON user_sessions(session_id);

-- Insert St. Louis locations
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

-- Update existing prompts to have category mapping
-- Map your current 'type' values to new 'category' values
UPDATE prompts SET category = 'generative' WHERE type = 'prompt';
UPDATE prompts SET category = 'complete_shape' WHERE type = 'complete_drawing';
UPDATE prompts SET category = 'generative' WHERE type = 'freehand';

-- Add new generic prompts (location_id = NULL)
INSERT INTO prompts (content, type, active, category, requires_shape, requires_gallery_image, location_id, weight) VALUES
-- New generative prompts
('draw with your eyes closed', 'prompt', true, 'generative', false, false, NULL, 1),
('draw with only one line', 'prompt', true, 'generative', false, false, NULL, 1),
('draw what''s in front of you', 'prompt', true, 'generative', false, false, NULL, 1),
('draw your last dream', 'prompt', true, 'generative', false, false, NULL, 1),
('do scribbles', 'prompt', true, 'generative', false, false, NULL, 1),
('try to fill up the page', 'prompt', true, 'generative', false, false, NULL, 1),
('draw something with a shadow', 'prompt', true, 'generative', false, false, NULL, 1),
('draw your favorite food', 'prompt', true, 'generative', false, false, NULL, 1),
('draw your pet (real or imaginary)', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a self-portrait', 'prompt', true, 'generative', false, false, NULL, 1),
('draw your childhood home', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a memory from today', 'prompt', true, 'generative', false, false, NULL, 1),
('draw with your non-dominant hand', 'prompt', true, 'generative', false, false, NULL, 1),
('draw without lifting your pen', 'prompt', true, 'generative', false, false, NULL, 1),
('draw the first thing that comes to mind', 'prompt', true, 'generative', false, false, NULL, 1),
('draw your ideal vacation', 'prompt', true, 'generative', false, false, NULL, 1),
('draw something that makes you happy', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a tree', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a flower', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a mountain', 'prompt', true, 'generative', false, false, NULL, 1),
('draw the ocean', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a bird', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a house', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a car', 'prompt', true, 'generative', false, false, NULL, 1),
('draw a face', 'prompt', true, 'generative', false, false, NULL, 1),

-- New complete_shape prompts
('complete the shape', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('finish this organic form', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('add to this swirl', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('complete this wave', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('finish this spiral', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('complete this leaf shape', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('add to this cloud', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('finish this mountain silhouette', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('complete this river curve', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('add to this tree', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('finish this flower', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('complete this stone', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),
('add to this bamboo', 'complete_drawing', true, 'complete_shape', true, false, NULL, 1),

-- Subject-based prompts
('draw a cat', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a dog', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a bird', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a fish', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a tree', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a flower', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a house', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a car', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a person', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a face', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a hand', 'prompt', true, 'subject', false, false, NULL, 1),
('draw an eye', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a heart', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a star', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a circle', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a square', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a triangle', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a spiral', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a wave', 'prompt', true, 'subject', false, false, NULL, 1),
('draw a cloud', 'prompt', true, 'subject', false, false, NULL, 1);
