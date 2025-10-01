-- Create feedback table from scratch
-- This will create the table with all the columns we need

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'micro_survey', 'mode_switch', 'tool_usage', 'drawing_completed', etc.
  response TEXT NOT NULL, -- The actual feedback response
  metadata JSONB DEFAULT '{}', -- Additional context data
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  user_uuid VARCHAR(100), -- Link to user
  drawing_id UUID REFERENCES drawings(id), -- Link to specific drawing if applicable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_user_uuid ON feedback(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_drawing_id ON feedback(drawing_id);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts and reads
CREATE POLICY "Allow feedback inserts" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow feedback reads" ON feedback
  FOR SELECT USING (true);

-- Verify the table was created
SELECT 'feedback table created successfully' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;
