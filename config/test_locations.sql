-- Test locations for diverse color themes
-- These locations will test different city, state, and coordinate-based colors

-- California locations (Golden theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Golden Gate Park', 'golden-gate-park', 37.7694, -122.4862, 500, 'San Francisco', 'CA', true),
('Hollywood Sign', 'hollywood-sign', 34.1341, -118.3215, 300, 'Los Angeles', 'CA', true),
('Yosemite Valley', 'yosemite-valley', 37.8651, -119.5383, 1000, 'Yosemite', 'CA', true);

-- New York locations (Navy/Gray theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Central Park', 'central-park', 40.7829, -73.9654, 800, 'New York', 'NY', true),
('Brooklyn Bridge', 'brooklyn-bridge', 40.7061, -73.9969, 400, 'New York', 'NY', true),
('Times Square', 'times-square', 40.7580, -73.9855, 300, 'New York', 'NY', true);

-- Florida locations (Aqua theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('South Beach', 'south-beach', 25.7907, -80.1300, 500, 'Miami', 'FL', true),
('Key West', 'key-west', 24.5551, -81.7826, 300, 'Key West', 'FL', true);

-- Washington locations (Green theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Space Needle', 'space-needle', 47.6205, -122.3493, 400, 'Seattle', 'WA', true),
('Pike Place Market', 'pike-place', 47.6097, -122.3331, 300, 'Seattle', 'WA', true);

-- Colorado locations (Gold theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Red Rocks', 'red-rocks', 39.6653, -105.2056, 500, 'Denver', 'CO', true),
('Garden of the Gods', 'garden-gods', 38.8814, -104.8756, 800, 'Colorado Springs', 'CO', true);

-- Texas locations (Gray theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Alamo', 'alamo', 29.4258, -98.4861, 200, 'San Antonio', 'TX', true),
('Austin Capitol', 'austin-capitol', 30.2747, -97.7404, 300, 'Austin', 'TX', true);

-- Illinois locations (Red theme)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Millennium Park', 'millennium-park', 41.8826, -87.6226, 400, 'Chicago', 'IL', true),
('Navy Pier', 'navy-pier', 41.8919, -87.6086, 300, 'Chicago', 'IL', true);

-- Generic locations (coordinate-based colors)
INSERT INTO locations (name, slug, latitude, longitude, radius_meters, city, state, is_active) VALUES
('Random Location 1', 'random-1', 40.7128, -74.0060, 500, 'New York', 'NY', true),
('Random Location 2', 'random-2', 34.0522, -118.2437, 500, 'Los Angeles', 'CA', true),
('Random Location 3', 'random-3', 41.8781, -87.6298, 500, 'Chicago', 'IL', true);
