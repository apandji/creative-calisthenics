# Session and Feedback Testing Guide

## 🎯 What We Fixed

### **Database Schema Updates**
- **user_sessions table**: Tracks user sessions with start/end times
- **feedback table**: Now links to both session_id and user_uuid
- **drawing_id**: Links feedback to specific drawings
- **Proper relationships**: All data is now connected

### **Session Tracking**
- **Session creation**: Automatically creates session on page load
- **Session updates**: Tracks duration and end time
- **Drawing linking**: Links feedback to specific drawings
- **User consistency**: Uses same user_uuid across all tables

## 🧪 Testing Steps

### **1. Database Setup**
```sql
-- Run this in Supabase SQL editor:
-- (Copy from config/setup_feedback.sql)
```

### **2. Test Session Creation**
1. Open http://localhost:8001
2. Check browser console for:
   - "FeedbackCollector initialized with session: [session_id] user: [user_uuid]"
   - "Session created successfully: [session_id]"
3. Check Supabase `user_sessions` table for new record

### **3. Test Drawing Submission**
1. Draw something on the canvas
2. Click submit button
3. Check console for:
   - "Drawing submitted with ID: [drawing_id]"
4. Check Supabase `drawings` table for new record
5. Check `feedback` table for linked feedback

### **4. Test Feedback Collection**
1. Switch modes 3 times (should trigger survey)
2. Complete a drawing (should trigger survey)
3. Leave the page (should trigger session end survey)
4. Check `feedback` table for all feedback records

### **5. Verify Relationships**
```sql
-- Check session data
SELECT * FROM user_sessions ORDER BY started_at DESC LIMIT 5;

-- Check feedback linked to sessions
SELECT f.*, s.started_at, s.duration_seconds 
FROM feedback f 
JOIN user_sessions s ON f.session_id = s.session_id 
ORDER BY f.created_at DESC LIMIT 10;

-- Check feedback linked to drawings
SELECT f.*, d.prompt, d.created_at as drawing_created
FROM feedback f 
LEFT JOIN drawings d ON f.drawing_id = d.id 
ORDER BY f.created_at DESC LIMIT 10;
```

## 🔍 Debug Commands

### **Check Session Data**
```javascript
// In browser console
console.log('Session ID:', window.feedbackCollector.sessionId);
console.log('User UUID:', window.feedbackCollector.userUUID);
console.log('Session Data:', window.feedbackCollector.sessionData);
```

### **Check Local Feedback**
```javascript
// View all local feedback
console.log(window.feedbackCollector.getLocalFeedback());
```

### **Manually Test Session Creation**
```javascript
// Test session creation
window.feedbackCollector.createSession();
```

### **Test Drawing Tracking**
```javascript
// Simulate drawing submission
window.feedbackCollector.trackDrawingSubmitted('test-drawing-id');
```

## 📊 Expected Data Structure

### **user_sessions Table**
```json
{
  "id": "uuid",
  "session_id": "session_1234567890_abc123",
  "user_uuid": "user-uuid-from-localStorage",
  "started_at": "2024-01-01T12:00:00Z",
  "ended_at": "2024-01-01T12:05:00Z",
  "duration_seconds": 300,
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### **feedback Table**
```json
{
  "id": 1,
  "type": "drawing_completed",
  "response": "completed",
  "session_id": "session_1234567890_abc123",
  "user_uuid": "user-uuid-from-localStorage",
  "drawing_id": "drawing-uuid",
  "metadata": {
    "mode": "prompt",
    "duration": 45000,
    "strokeCount": 23
  },
  "created_at": "2024-01-01T12:02:00Z"
}
```

## 🎯 Success Criteria

- [ ] Sessions are created in `user_sessions` table
- [ ] Feedback is linked to sessions via `session_id`
- [ ] Feedback is linked to drawings via `drawing_id`
- [ ] All data uses consistent `user_uuid`
- [ ] Session duration is tracked correctly
- [ ] Drawing submissions are tracked
- [ ] Micro-surveys appear and submit data

## 🐛 Troubleshooting

### **If Sessions Don't Appear**
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies

### **If Feedback Isn't Linked**
- Check that `session_id` and `user_uuid` are consistent
- Verify drawing submission returns ID
- Check foreign key constraints

### **If Data Is Inconsistent**
- Clear localStorage and refresh
- Check that user_uuid is consistent across tables
- Verify session_id generation

## 📈 Analytics Queries

### **Session Analytics**
```sql
-- Average session duration
SELECT AVG(duration_seconds) as avg_duration 
FROM user_sessions 
WHERE ended_at IS NOT NULL;

-- Sessions per user
SELECT user_uuid, COUNT(*) as session_count 
FROM user_sessions 
GROUP BY user_uuid 
ORDER BY session_count DESC;
```

### **Feedback Analytics**
```sql
-- Feedback by type
SELECT type, COUNT(*) as count 
FROM feedback 
GROUP BY type 
ORDER BY count DESC;

-- Feedback linked to drawings
SELECT COUNT(*) as feedback_with_drawings 
FROM feedback 
WHERE drawing_id IS NOT NULL;
```

### **User Journey**
```sql
-- Complete user journey for a session
SELECT 
  s.session_id,
  s.duration_seconds,
  f.type,
  f.response,
  d.prompt
FROM user_sessions s
LEFT JOIN feedback f ON s.session_id = f.session_id
LEFT JOIN drawings d ON f.drawing_id = d.id
WHERE s.session_id = 'your-session-id'
ORDER BY f.created_at;
```
