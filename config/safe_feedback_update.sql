-- SAFE VERSION: No data destruction, only additions
-- This will NOT delete or modify any existing data

-- Step 1: Create user_sessions table (safe - new table)
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

-- Step 2: Add missing columns to existing feedback table (safe - only adds)
ALTER TABLE feedback 
ADD COLUMN IF NOT EXISTS user_uuid VARCHAR(100),
ADD COLUMN IF NOT EXISTS drawing_id UUID REFERENCES drawings(id);

-- Step 3: Create indexes (safe - only creates if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_uuid ON user_sessions(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_user_uuid ON feedback(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_drawing_id ON feedback(drawing_id);

-- Step 4: Enable RLS on user_sessions (safe - new table)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies (safe - only creates if they don't exist)
CREATE POLICY IF NOT EXISTS "Allow session inserts" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow session reads" ON user_sessions
  FOR SELECT USING (true);

-- Step 6: Verify everything worked
SELECT 'user_sessions table created' as status, COUNT(*) as count FROM user_sessions;
SELECT 'feedback table updated' as status, COUNT(*) as count FROM feedback;
SELECT 'drawings table preserved' as status, COUNT(*) as count FROM drawings;
SELECT 'prompts table preserved' as status, COUNT(*) as count FROM prompts;
