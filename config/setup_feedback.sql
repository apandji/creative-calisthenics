-- Create feedback table for collecting user feedback and analytics
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'micro_survey', 'session_end', 'mode_preference', 'drawing_completed', etc.
  response TEXT NOT NULL, -- The actual feedback response
  metadata JSONB DEFAULT '{}', -- Additional context data
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id ON feedback(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (users can submit feedback)
CREATE POLICY "Allow feedback inserts" ON feedback
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (for admin dashboard)
CREATE POLICY "Allow feedback reads" ON feedback
  FOR SELECT USING (true);
