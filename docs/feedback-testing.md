# Feedback Collection System Testing Guide

## 🎯 What Was Implemented

### **Database Setup**
- Created `feedback` table in Supabase with RLS policies
- Supports multiple feedback types: micro_surveys, session_end, mode_preference, etc.
- Includes metadata storage for rich analytics

### **Feedback Collection Features**
- **Micro-surveys**: 30% probability to avoid overwhelming users
- **Session tracking**: Duration, drawings completed, modes used
- **Drawing analytics**: Mode, duration, stroke count
- **Mode switching**: Tracks user preferences
- **Tool usage**: Brush vs eraser patterns

### **Fallback System**
- Stores feedback locally if Supabase unavailable
- Graceful error handling
- Console logging for debugging

## 🧪 Testing Instructions

### **1. Database Setup**
```sql
-- Run this in your Supabase SQL editor:
-- (Copy from config/setup_feedback.sql)
```

### **2. Local Testing**
1. Open http://localhost:8001
2. Open browser console (F12)
3. Look for "FeedbackCollector initialized" message
4. Draw something - should see "Feedback submitted successfully" messages

### **3. Test Micro-Surveys**
1. **First Drawing**: After completing first drawing, should see "How did that feel?" survey
2. **Mode Switching**: After 3 mode switches, should see "Which mode do you prefer?" survey
3. **Session End**: When leaving page, should see "One word to describe your drift?" survey

### **4. Test Data Collection**
```javascript
// In browser console, check local feedback:
window.feedbackCollector.getLocalFeedback()

// Check session data:
window.feedbackCollector.sessionData

// Clear local feedback for testing:
window.feedbackCollector.clearLocalFeedback()
```

### **5. Test Supabase Integration**
1. Check Supabase dashboard for new `feedback` table
2. Verify data is being inserted
3. Check RLS policies are working

## 📊 Expected Data

### **Feedback Types**
- `first_drawing_feeling`: User's emotional response to first drawing
- `mode_preference`: Which mode users prefer
- `session_end_mood`: Overall session experience
- `drawing_completed`: Technical drawing data
- `mode_switched`: Mode switching patterns
- `session_end`: Complete session summary

### **Metadata Examples**
```json
{
  "mode": "prompt",
  "duration": 45000,
  "strokeCount": 23,
  "session_drawings": 1,
  "modes_used": ["prompt", "complete"],
  "tools_used": ["brush", "eraser"],
  "session_duration": 120
}
```

## 🐛 Troubleshooting

### **If Supabase Connection Fails**
- Check browser console for errors
- Verify Supabase URL and key are correct
- Data will be stored locally as fallback

### **If Micro-Surveys Don't Appear**
- Check console for "FeedbackCollector initialized" message
- Try refreshing page
- Check if surveys are being skipped (30% probability)

### **If Data Not Appearing in Supabase**
- Check RLS policies
- Verify table permissions
- Check browser console for submission errors

## 🎯 Success Criteria

- [ ] FeedbackCollector initializes without errors
- [ ] Micro-surveys appear at appropriate times
- [ ] Data is submitted to Supabase successfully
- [ ] Local fallback works when Supabase unavailable
- [ ] Session tracking captures user behavior
- [ ] Analytics events are fired correctly

## 📈 Next Steps

1. **Monitor Supabase dashboard** for incoming feedback
2. **Analyze patterns** in user behavior
3. **Adjust survey frequency** based on user response
4. **Create admin dashboard** for feedback visualization
5. **Implement A/B testing** for different survey questions

## 🔧 Debugging Commands

```javascript
// Check if feedback collector is working
console.log(window.feedbackCollector);

// View all local feedback
console.log(window.feedbackCollector.getLocalFeedback());

// Check session data
console.log(window.feedbackCollector.sessionData);

// Manually trigger a survey
window.feedbackCollector.showMicroSurvey(
  "Test Survey", 
  ["Option 1", "Option 2"], 
  "test_survey"
);

// Clear all local data
window.feedbackCollector.clearLocalFeedback();
```
