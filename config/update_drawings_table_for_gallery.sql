-- Update existing drawings table for Driftpad v2 gallery feature
-- This safely adds gallery functionality to your existing drawings table

-- Add new columns to existing drawings table (SAFE - won't break existing data)
ALTER TABLE drawings 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_erase_eligible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_add_eligible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for gallery queries
CREATE INDEX IF NOT EXISTS idx_drawings_erase_eligible ON drawings(is_erase_eligible, is_public) WHERE is_erase_eligible = TRUE AND is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_drawings_add_eligible ON drawings(is_add_eligible, is_public) WHERE is_add_eligible = TRUE AND is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_drawings_public ON drawings(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_drawings_created_at ON drawings(created_at);

-- Update existing drawings to be gallery eligible (optional - you can decide which ones)
-- This makes all existing drawings eligible for both erase and add prompts
-- You can modify this query to be more selective if you want
UPDATE drawings 
SET is_erase_eligible = TRUE, 
    is_add_eligible = TRUE,
    is_public = TRUE,
    title = 'Community Drawing',
    description = 'Shared creative work'
WHERE is_erase_eligible IS NULL;

-- Note: You can also manually curate which drawings become gallery eligible
-- by running specific UPDATE queries like:
-- UPDATE drawings SET is_erase_eligible = TRUE, is_public = TRUE WHERE user_uuid = 'specific-user-id';
-- UPDATE drawings SET is_add_eligible = TRUE, is_public = TRUE WHERE user_uuid = 'specific-user-id';
