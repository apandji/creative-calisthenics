-- Driftpad v2 Database Setup
-- Run this in your Supabase SQL editor

-- Enable PostGIS extension for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create locations table
CREATE TABLE locations (
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

-- Create prompts table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  requires_shape BOOLEAN DEFAULT FALSE,
  requires_gallery_image BOOLEAN DEFAULT FALSE,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create gallery_images table
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Optional for community images
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create user_sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  last_prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_prompts_generic ON prompts(category, is_active) WHERE location_id IS NULL AND is_active = TRUE;
CREATE INDEX idx_prompts_location ON prompts(location_id, category, is_active) WHERE location_id IS NOT NULL AND is_active = TRUE;
CREATE INDEX idx_locations_coords ON locations(latitude, longitude, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_locations_slug ON locations(slug) WHERE is_active = TRUE;
CREATE INDEX idx_gallery_public_active ON gallery_images(is_public, is_active) WHERE is_public = TRUE AND is_active = TRUE;
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);

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
('The Hill', 'the-hill', 38.6000, -90.2400, 400, 'St. Louis', 'MO');

-- Insert generic prompts (location_id = NULL)
INSERT INTO prompts (text, category, requires_shape, requires_gallery_image, location_id) VALUES
-- Generative prompts
('draw with your eyes closed', 'generative', FALSE, FALSE, NULL),
('draw with only one line', 'generative', FALSE, FALSE, NULL),
('draw what''s in front of you', 'generative', FALSE, FALSE, NULL),
('draw your last dream', 'generative', FALSE, FALSE, NULL),
('do scribbles', 'generative', FALSE, FALSE, NULL),
('try to fill up the page', 'generative', FALSE, FALSE, NULL),
('draw something with a shadow', 'generative', FALSE, FALSE, NULL),
('draw your favorite food', 'generative', FALSE, FALSE, NULL),
('draw your pet (real or imaginary)', 'generative', FALSE, FALSE, NULL),
('draw a self-portrait', 'generative', FALSE, FALSE, NULL),
('draw your childhood home', 'generative', FALSE, FALSE, NULL),
('draw a memory from today', 'generative', FALSE, FALSE, NULL),
('draw with your non-dominant hand', 'generative', FALSE, FALSE, NULL),
('draw without lifting your pen', 'generative', FALSE, FALSE, NULL),
('draw the first thing that comes to mind', 'generative', FALSE, FALSE, NULL),
('draw your ideal vacation', 'generative', FALSE, FALSE, NULL),
('draw something that makes you happy', 'generative', FALSE, FALSE, NULL),
('draw a tree', 'generative', FALSE, FALSE, NULL),
('draw a flower', 'generative', FALSE, FALSE, NULL),
('draw a mountain', 'generative', FALSE, FALSE, NULL),
('draw the ocean', 'generative', FALSE, FALSE, NULL),
('draw a bird', 'generative', FALSE, FALSE, NULL),
('draw a house', 'generative', FALSE, FALSE, NULL),
('draw a car', 'generative', FALSE, FALSE, NULL),
('draw a face', 'generative', FALSE, FALSE, NULL),

-- Complete shape prompts
('complete the shape', 'complete_shape', TRUE, FALSE, NULL),
('finish this organic form', 'complete_shape', TRUE, FALSE, NULL),
('add to this swirl', 'complete_shape', TRUE, FALSE, NULL),
('complete this wave', 'complete_shape', TRUE, FALSE, NULL),
('finish this spiral', 'complete_shape', TRUE, FALSE, NULL),
('complete this leaf shape', 'complete_shape', TRUE, FALSE, NULL),
('add to this cloud', 'complete_shape', TRUE, FALSE, NULL),
('finish this mountain silhouette', 'complete_shape', TRUE, FALSE, NULL),
('complete this river curve', 'complete_shape', TRUE, FALSE, NULL),
('add to this tree', 'complete_shape', TRUE, FALSE, NULL),
('finish this flower', 'complete_shape', TRUE, FALSE, NULL),
('complete this stone', 'complete_shape', TRUE, FALSE, NULL),
('add to this bamboo', 'complete_shape', TRUE, FALSE, NULL),

-- Subject-based prompts
('draw a cat', 'subject', FALSE, FALSE, NULL),
('draw a dog', 'subject', FALSE, FALSE, NULL),
('draw a bird', 'subject', FALSE, FALSE, NULL),
('draw a fish', 'subject', FALSE, FALSE, NULL),
('draw a tree', 'subject', FALSE, FALSE, NULL),
('draw a flower', 'subject', FALSE, FALSE, NULL),
('draw a house', 'subject', FALSE, FALSE, NULL),
('draw a car', 'subject', FALSE, FALSE, NULL),
('draw a person', 'subject', FALSE, FALSE, NULL),
('draw a face', 'subject', FALSE, FALSE, NULL),
('draw a hand', 'subject', FALSE, FALSE, NULL),
('draw an eye', 'subject', FALSE, FALSE, NULL),
('draw a heart', 'subject', FALSE, FALSE, NULL),
('draw a star', 'subject', FALSE, FALSE, NULL),
('draw a circle', 'subject', FALSE, FALSE, NULL),
('draw a square', 'subject', FALSE, FALSE, NULL),
('draw a triangle', 'subject', FALSE, FALSE, NULL),
('draw a spiral', 'subject', FALSE, FALSE, NULL),
('draw a wave', 'subject', FALSE, FALSE, NULL),
('draw a cloud', 'subject', FALSE, FALSE, NULL);

-- Note: Location-specific prompts will be added in a separate file
-- This gives us a good foundation with 60+ generic prompts
