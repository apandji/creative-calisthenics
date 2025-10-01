-- Create user_sessions table to track user sessions
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

-- Create feedback table for collecting user feedback and analytics
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'micro_survey', 'session_end', 'mode_preference', 'drawing_completed', etc.
  response TEXT NOT NULL, -- The actual feedback response
  metadata JSONB DEFAULT '{}', -- Additional context data
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  session_id VARCHAR(100),
  user_uuid VARCHAR(100), -- Link to user
  drawing_id UUID REFERENCES drawings(id), -- Link to specific drawing if applicable
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_uuid ON user_sessions(user_uuid);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id ON feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_uuid ON feedback(user_uuid);
CREATE INDEX IF NOT EXISTS idx_feedback_drawing_id ON feedback(drawing_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Allow session inserts" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow session reads" ON user_sessions
  FOR SELECT USING (true);

-- Create policies for feedback
CREATE POLICY "Allow feedback inserts" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow feedback reads" ON feedback
  FOR SELECT USING (true);
