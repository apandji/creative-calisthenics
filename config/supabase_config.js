// Supabase Configuration for Driftpad v2
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL', // e.g., 'https://your-project.supabase.co'
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // Your public anon key
  serviceKey: 'YOUR_SUPABASE_SERVICE_KEY' // Your service role key (for server-side operations)
};

// API Endpoints for Driftpad v2
const API_ENDPOINTS = {
  // Get random prompt (generic or location-specific)
  getRandomPrompt: (locationId = null) => {
    const url = locationId 
      ? `${SUPABASE_CONFIG.url}/rest/v1/prompts?location_id=eq.${locationId}&is_active=eq.true&select=*&order=random()&limit=1`
      : `${SUPABASE_CONFIG.url}/rest/v1/prompts?location_id=is.null&is_active=eq.true&select=*&order=random()&limit=1`;
    return url;
  },

  // Get location by slug (for URL override)
  getLocationBySlug: (slug) => {
    return `${SUPABASE_CONFIG.url}/rest/v1/locations?slug=eq.${slug}&is_active=eq.true&select=*`;
  },

  // Find nearby locations by coordinates
  getNearbyLocations: (lat, lng) => {
    // This would use PostGIS functions in Supabase
    // For now, we'll use a simple distance calculation
    return `${SUPABASE_CONFIG.url}/rest/v1/locations?is_active=eq.true&select=*`;
  },

  // Get random gallery image
  getRandomGalleryImage: () => {
    return `${SUPABASE_CONFIG.url}/rest/v1/gallery_images?is_public=eq.true&is_active=eq.true&select=*&order=random()&limit=1`;
  },

  // Upload to gallery
  uploadToGallery: () => {
    return `${SUPABASE_CONFIG.url}/rest/v1/gallery_images`;
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
}

// Helper function to find nearby locations
function findNearbyLocations(locations, userLat, userLng) {
  return locations.filter(location => {
    const distance = calculateDistance(userLat, userLng, location.latitude, location.longitude);
    return distance <= location.radius_meters;
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_CONFIG,
    API_ENDPOINTS,
    calculateDistance,
    findNearbyLocations
  };
}
