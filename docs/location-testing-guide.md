# Location Testing Guide

## How to Test Different Location Colors

### 1. **Add Test Locations to Supabase**

Run the SQL in `config/test_locations.sql` to add diverse test locations:

```sql
-- This adds locations across different states and cities
-- Each will generate different color themes based on:
-- - City names (San Francisco, Los Angeles, etc.)
-- - State codes (CA, NY, FL, WA, CO, TX, IL)
-- - Coordinates (for unique color generation)
```

### 2. **Test Methods**

#### **Method A: URL Override Testing**
Use URL parameters to test specific locations:

```
?location=golden-gate-park    # San Francisco theme (blue)
?location=central-park       # New York theme (navy/gray)
?location=south-beach        # Miami theme (aqua)
?location=space-needle       # Seattle theme (green)
?location=red-rocks          # Denver theme (gold)
```

#### **Method B: Geolocation Testing**
Use browser dev tools to simulate different locations:

1. **Open Dev Tools** → Console
2. **Run this code** to simulate different coordinates:

```javascript
// Simulate San Francisco
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 37.7694, longitude: -122.4862 } });
};

// Simulate New York
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 40.7829, longitude: -73.9654 } });
};

// Simulate Miami
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 25.7907, longitude: -80.1300 } });
};
```

#### **Method C: Coordinate Testing**
Test coordinate-based colors by adding locations with unique coordinates:

```sql
-- Add a location with unique coordinates
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) 
VALUES ('Test Location', 'test-location', 45.1234, -93.5678, 500, 'Minneapolis', 'MN', true);
```

### 3. **Expected Color Themes**

| Location | City/State | Expected Theme | Colors 1-3 |
|----------|------------|----------------|------------|
| Golden Gate Park | San Francisco, CA | Fog city blue | Blues, teals |
| Central Park | New York, NY | Big apple gray | Grays, navies |
| South Beach | Miami, FL | Miami aqua | Aquas, cyans |
| Space Needle | Seattle, WA | Emerald green | Greens, forest |
| Red Rocks | Denver, CO | Mile high gold | Golds, oranges |
| Alamo | San Antonio, TX | Texas gray | Grays, browns |
| Millennium Park | Chicago, IL | Windy city navy | Navies, blues |

### 4. **Testing Checklist**

- [ ] **URL Override**: Test `?location=forest-park` (should show forest colors)
- [ ] **Geolocation**: Test with different coordinates
- [ ] **City Colors**: Test San Francisco, New York, Miami locations
- [ ] **State Colors**: Test CA, NY, FL, WA, CO, TX, IL locations
- [ ] **Coordinate Colors**: Test locations with unique lat/lng
- [ ] **Color Preview**: Verify colors 1-3 change, colors 4-5 stay consistent
- [ ] **Drawing**: Test that ink colors match the preview

### 5. **Debug Information**

Check the console for these logs:
- `"Using name-based colors for type: [type]"`
- `"Using city-based colors for: [city]"`
- `"Using state-based colors for: [state]"`
- `"Using coordinate-based colors for lat: [lat] lng: [lng]"`

### 6. **Adding Your Own Locations**

To test your own locations:

1. **Add to Supabase**:
```sql
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) 
VALUES ('Your Location', 'your-slug', 40.1234, -90.5678, 500, 'Your City', 'ST', true);
```

2. **Test with URL**: `?location=your-slug`
3. **Test with coordinates**: Use the lat/lng in geolocation testing

## Color Generation Logic

The system uses this priority order:

1. **Name keywords** (park, museum, downtown, etc.)
2. **City names** (st. louis, chicago, new york, etc.)
3. **State codes** (MO, IL, CA, NY, etc.)
4. **Coordinates** (unique color based on lat/lng)

Each level provides a different color theme, ensuring every location gets meaningful colors!
