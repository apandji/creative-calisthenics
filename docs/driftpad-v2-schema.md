# Driftpad v2 - Database Schema

## Prompts Table

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  requires_shape BOOLEAN DEFAULT FALSE,
  requires_gallery_image BOOLEAN DEFAULT FALSE,
  location_id UUID REFERENCES locations(id), -- NULL for generic prompts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Categories: 'generative', 'complete_shape', 'erase', 'subject', 'add_to_drawing'
-- location_id: NULL for generic prompts, specific location for location-based prompts
```

## Locations Table

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Human-readable location name
  slug VARCHAR(50) UNIQUE NOT NULL, -- URL-friendly identifier (e.g., 'forest-park')
  latitude DECIMAL(10, 8) NOT NULL, -- GPS latitude
  longitude DECIMAL(11, 8) NOT NULL, -- GPS longitude
  radius_meters INTEGER DEFAULT 500, -- Detection radius in meters
  city VARCHAR(50) DEFAULT 'St. Louis', -- City for organization
  state VARCHAR(50) DEFAULT 'MO', -- State for organization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

## Gallery Images Table

```sql
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
```

## User Sessions Table (for prompt history)

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, -- Local storage session ID
  last_prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- For random prompt selection (generic prompts)
CREATE INDEX idx_prompts_generic ON prompts(category, is_active) WHERE location_id IS NULL AND is_active = TRUE;

-- For location-specific prompt selection
CREATE INDEX idx_prompts_location ON prompts(location_id, category, is_active) WHERE location_id IS NOT NULL AND is_active = TRUE;

-- For location detection by coordinates
CREATE INDEX idx_locations_coords ON locations(latitude, longitude, is_active) WHERE is_active = TRUE;

-- For gallery image selection
CREATE INDEX idx_gallery_public_active ON gallery_images(is_public, is_active) WHERE is_public = TRUE AND is_active = TRUE;

-- For session tracking
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);
```

## API Endpoints for Location-Based Prompts

```sql
-- Get location-specific prompts (prioritized)
SELECT * FROM prompts 
WHERE location_id = $1 AND is_active = TRUE 
ORDER BY RANDOM() 
LIMIT 5;

-- Get generic prompts (fallback)
SELECT * FROM prompts 
WHERE location_id IS NULL AND is_active = TRUE 
ORDER BY RANDOM() 
LIMIT 5;

-- Find nearby locations by coordinates
SELECT id, name, slug, latitude, longitude, radius_meters 
FROM locations 
WHERE is_active = TRUE 
AND ST_DWithin(
  ST_Point(longitude, latitude), 
  ST_Point($1, $2), 
  radius_meters
);

-- Find location by slug (for URL override)
SELECT id, name, slug, latitude, longitude, radius_meters 
FROM locations 
WHERE slug = $1 AND is_active = TRUE;
```

## St. Louis Test Locations

```sql
-- Insert St. Louis test locations
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state) VALUES
('Forest Park', 'forest-park', 38.6386, -90.2847, 800, 'St. Louis', 'MO'),
('Gateway Arch', 'gateway-arch', 38.6247, -90.1847, 300, 'St. Louis', 'MO'),
('Mississippi Riverfront', 'riverfront', 38.6250, -90.1800, 500, 'St. Louis', 'MO'),
('Tower Grove Park', 'tower-grove-park', 38.6100, -90.2600, 600, 'St. Louis', 'MO'),
('Laclede\'s Landing', 'lacledes-landing', 38.6300, -90.1900, 400, 'St. Louis', 'MO'),
('Soulard Market', 'soulard-market', 38.6000, -90.2200, 300, 'St. Louis', 'MO'),
('Cathedral Basilica', 'cathedral-basilica', 38.6400, -90.2500, 200, 'St. Louis', 'MO'),
('City Museum', 'city-museum', 38.6350, -90.2000, 250, 'St. Louis', 'MO'),
('Union Station', 'union-station', 38.6250, -90.2100, 300, 'St. Louis', 'MO'),
('The Hill', 'the-hill', 38.6000, -90.2400, 400, 'St. Louis', 'MO');
```
