-- Run this in your Supabase SQL Editor to set up the prompts table

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('prompt', 'complete_drawing', 'freehand')),
    content TEXT NOT NULL,
    weight INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_prompts_type_active ON prompts(type, active);

-- Insert sample data
INSERT INTO prompts (type, content, weight) VALUES
-- Regular prompts
('prompt', 'elephant with a flower hat.', 1),
('prompt', 'city skyline made of books.', 1),
('prompt', 'teacup sailing on an ocean of paint.', 1),
('prompt', 'bicycle that turns into a bird.', 1),
('prompt', 'tiny astronaut exploring a houseplant.', 1),
('prompt', 'a tree that grows backwards.', 1),
('prompt', 'clouds shaped like musical instruments.', 1),
('prompt', 'a house made of light.', 1),

-- Complete the drawing prompts
('complete_drawing', 'complete the drawing.', 1),

-- Freehand prompts (weighted so "let your mind drift" appears more often)
('freehand', 'let your mind drift.', 5),
('freehand', 'take a drink of water.', 1),
('freehand', 'call a friend.', 1),
('freehand', 'stretch your arms.', 1),
('freehand', 'take three deep breaths.', 1),
('freehand', 'look out the window.', 1),
('freehand', 'smile at yourself.', 1),
('freehand', 'go touch grass.', 1),
('freehand', 'step outside for a moment.', 1),
('freehand', 'look at something far away.', 1),
('freehand', 'take a walk around the room.', 1);
