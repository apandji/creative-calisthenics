# Driftpad v2 Database Setup Guide

## 🗄️ **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "driftpad-v2")
3. Set a database password (save this securely!)
4. Choose a region close to your users
5. Wait for the project to be created (usually 2-3 minutes)

## 🏗️ **Step 2: Set Up Database Schema**

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the contents of `config/setup_driftpad_v2.sql`
4. Click "Run" to execute the schema creation
5. You should see success messages for table creation and data insertion

## 📍 **Step 3: Add St. Louis Location Prompts**

1. In the same SQL Editor, copy and paste the contents of `config/insert_st_louis_prompts.sql`
2. Click "Run" to insert all the St. Louis location-specific prompts
3. You should see success messages for the prompt insertions

## 🔑 **Step 4: Get API Credentials**

1. Go to "Settings" → "API" in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

## ⚙️ **Step 5: Configure API Access**

1. Open `config/supabase_config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
     url: 'https://your-project.supabase.co', // Your actual URL
     anonKey: 'eyJ...', // Your actual anon key
     serviceKey: 'eyJ...' // Your actual service key
   };
   ```

## 🔒 **Step 6: Set Up Row Level Security (RLS)**

Run this SQL in your Supabase SQL Editor to set up proper security:

```sql
-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to prompts" ON prompts FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to gallery_images" ON gallery_images FOR SELECT USING (is_public = true AND is_active = true);

-- Allow public insert for user_sessions (for session tracking)
CREATE POLICY "Allow public insert on user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on user_sessions" ON user_sessions FOR UPDATE USING (true);

-- Allow public insert for gallery_images (for user uploads)
CREATE POLICY "Allow public insert on gallery_images" ON gallery_images FOR INSERT WITH CHECK (true);
```

## ✅ **Step 7: Verify Setup**

Run this query to verify everything is working:

```sql
-- Check locations
SELECT COUNT(*) as location_count FROM locations WHERE is_active = true;

-- Check generic prompts
SELECT COUNT(*) as generic_prompt_count FROM prompts WHERE location_id IS NULL AND is_active = true;

-- Check location-specific prompts
SELECT l.name, COUNT(p.id) as prompt_count 
FROM locations l 
LEFT JOIN prompts p ON l.id = p.location_id AND p.is_active = true
GROUP BY l.id, l.name
ORDER BY l.name;
```

You should see:
- **10 locations** (St. Louis locations)
- **60+ generic prompts** (location_id = NULL)
- **80 location-specific prompts** (8 per location)

## 🧪 **Step 8: Test API Endpoints**

You can test the API endpoints using curl or your browser:

```bash
# Test getting a generic prompt
curl "https://your-project.supabase.co/rest/v1/prompts?location_id=is.null&is_active=eq.true&select=*&order=random()&limit=1" \
  -H "apikey: YOUR_ANON_KEY"

# Test getting a location-specific prompt
curl "https://your-project.supabase.co/rest/v1/prompts?location_id=eq.LOCATION_ID&is_active=eq.true&select=*&order=random()&limit=1" \
  -H "apikey: YOUR_ANON_KEY"

# Test getting a location by slug
curl "https://your-project.supabase.co/rest/v1/locations?slug=eq.forest-park&is_active=eq.true&select=*" \
  -H "apikey: YOUR_ANON_KEY"
```

## 🚀 **Next Steps**

Once the database is set up, you can:

1. **Update the frontend** to use the new prompt system
2. **Implement location detection** with the St. Louis coordinates
3. **Add URL override functionality** for testing different locations
4. **Integrate shape generator** with completion prompts

## 📊 **Database Summary**

After setup, you'll have:
- **10 St. Louis locations** with precise coordinates
- **60+ generic prompts** for fallback
- **80 location-specific prompts** (8 per location)
- **Proper indexing** for fast queries
- **Row Level Security** for data protection

Total: **140+ prompts** ready for testing!
