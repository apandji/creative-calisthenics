-- Alternative: Just update the existing feedback table
-- Use this if you want to keep existing feedback data

-- Add missing columns to existing feedback table
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS user_uuid VARCHAR(100),
ADD COLUMN IF NOT EXISTS drawing_id UUID REFERENCES drawings(id);

-- Create user_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  user_uuid VARCHAR(100) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_uuid ON user_sessions(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_user_uuid ON feedback(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_drawing_id ON feedback(drawing_id);

-- Enable RLS on user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow session inserts" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow session reads" ON user_sessions
  FOR SELECT USING (true);

-- Verify
SELECT 'Tables updated successfully' as status;
