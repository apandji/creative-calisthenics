-- Simple feedback table update - just add user_uuid column
-- This is safe and won't destroy any existing data

-- Add user_uuid column to existing feedback table
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS user_uuid VARCHAR(100);

-- Add drawing_id column to link feedback to specific drawings
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS drawing_id UUID REFERENCES drawings(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_uuid ON feedback(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_drawing_id ON feedback(drawing_id);

-- Verify the update worked
SELECT 'feedback table updated successfully' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'feedback' 
AND column_name IN ('user_uuid', 'drawing_id');
