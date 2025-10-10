# Driftpad v2 - Product Requirements Document

## 🎯 Vision Statement

Transform Driftpad into a simplified, prompt-driven creative experience that removes decision fatigue and encourages spontaneous artistic expression through curated creative challenges.

## 🎨 Core Value Proposition

**"One button, infinite creativity"** - Users get a single refresh button that generates inspiring prompts, eliminating the need to choose between modes and encouraging creative exploration.

## 👥 Target Users

- **Primary**: Creative individuals seeking daily artistic practice
- **Secondary**: People looking for mindful, meditative drawing experiences
- **Tertiary**: Artists wanting to break creative blocks

## 🚀 Key Features

### 1. Simplified Interface
- **Single refresh button** replaces mode selection
- **Clean, minimal UI** focused on the prompt and canvas
- **No decision fatigue** - the app chooses the creative direction

### 2. Enhanced Prompt System
- **5 prompt categories**: Generative, Complete Shape, Erase, Add to Drawing, Subject-based
- **Smart randomization** prevents showing the same prompt twice in a row
- **Context-aware prompts** that work with the current canvas state
- **Location-based prompts** that adapt to user's physical location or URL
- **Opt-in geolocation** with URL override capability

### 3. Gallery Integration
- **Community gallery** with curated drawings
- **User's own gallery** for personal drawings
- **Smart image selection** for prompts that require existing artwork

### 4. Seamless Shape Integration
- **Automatic shape generation** for "complete the shape" prompts
- **Organic shape library** from existing shape generator
- **Contextual shape selection** based on prompt type

## 📋 User Stories

### Epic 1: Simplified User Experience

**As a user, I want to start drawing immediately without choosing modes, so I can focus on creativity instead of decisions.**

- **US1.1**: As a user, I want to see a single refresh button, so I don't have to choose between different modes
- **US1.2**: As a user, I want the app to automatically generate a creative prompt, so I can start drawing immediately
- **US1.3**: As a user, I want a clean, minimal interface, so I can focus on the creative process

### Epic 2: Enhanced Prompt System

**As a user, I want diverse, inspiring prompts that challenge my creativity in different ways.**

- **US2.1**: As a user, I want to receive generative prompts (like "draw with your eyes closed"), so I can explore different creative techniques
- **US2.2**: As a user, I want to receive shape completion prompts, so I can practice finishing organic forms
- **US2.3**: As a user, I want to receive erase prompts, so I can practice editing and reimagining existing artwork
- **US2.4**: As a user, I want to receive "add to drawing" prompts, so I can collaborate with existing artwork
- **US2.5**: As a user, I want to receive subject-based prompts, so I can practice drawing specific objects
- **US2.6**: As a user, I want to receive location-specific prompts when I'm at a special place, so I can create art inspired by my surroundings
- **US2.7**: As a user, I want to opt-in to location detection, so I can control my privacy while still getting contextual prompts
- **US2.8**: As a user, I want to override location detection with URL parameters, so I can test or simulate different locations

### Epic 3: Gallery Integration

**As a user, I want to interact with a diverse collection of artwork, so I can learn from and build upon others' creativity.**

- **US3.1**: As a user, I want to see community drawings in prompts, so I can be inspired by others' work
- **US3.2**: As a user, I want to use my own saved drawings in prompts, so I can revisit and improve my work
- **US3.3**: As a user, I want the app to intelligently select appropriate images for prompts, so the experience feels curated

### Epic 4: Seamless Shape Integration

**As a user, I want shape completion prompts to automatically provide the starting shape, so I can focus on the creative challenge.**

- **US4.1**: As a user, I want "complete the shape" prompts to automatically generate an organic shape, so I don't have to create the starting point
- **US4.2**: As a user, I want the generated shapes to be varied and interesting, so each prompt feels fresh
- **US4.3**: As a user, I want the shapes to match the prompt type, so the experience feels cohesive

## 🔄 User Flow

### Primary Flow: Creative Session

1. **User opens app** → Sees clean interface with single refresh button
2. **User clicks refresh** → App generates random prompt and displays it
3. **User sees prompt** → Prompt appears with any required assets (shapes, gallery images)
4. **User draws** → Creates artwork following the prompt
5. **User completes drawing** → Clicks submit/save
6. **App generates new prompt** → User can continue with new challenge
7. **User clicks refresh** → Gets new random prompt (different from previous)

### Secondary Flow: Gallery Interaction

1. **User gets "add to drawing" prompt** → App loads community/user gallery image
2. **User sees existing artwork** → Can add to, modify, or continue the piece
3. **User creates new version** → Saves as new artwork in their gallery
4. **User can share** → Option to contribute to community gallery

## 🎨 Prompt Categories & Examples

### 1. Generative (Blank Canvas)
- "draw with your eyes closed"
- "draw with only one line"
- "draw what's in front of you"
- "draw your last dream"

### 2. Complete Shape (Shape Generator Integration)
- "complete the shape" + auto-generated organic shape
- "finish this swirl" + auto-generated swirl
- "add to this leaf" + auto-generated leaf shape

### 3. Erase (Gallery Integration)
- "erase and draw again" + random gallery image
- "erase part of this drawing and add something new" + gallery image

### 4. Add to Drawing (Gallery Integration)
- "add to the drawing" + random gallery image
- "continue this artwork" + community drawing
- "add a character to this scene" + landscape image

### 5. Subject-Based (Blank Canvas)
- "draw a cat"
- "draw a tree"
- "draw a face"

### 6. Location-Based Prompts (Context-Aware)
- **Beach**: "draw the waves", "draw a sandcastle", "draw what you hear"
- **Mountain**: "draw the peak", "draw the path ahead", "draw the view"
- **City**: "draw the skyline", "draw the people around you", "draw the architecture"
- **Forest**: "draw the trees", "draw the sunlight filtering through", "draw the forest floor"
- **Desert**: "draw the dunes", "draw the mirage", "draw the vastness"

### 7. St. Louis Location-Specific Prompts (Testing)
- **Forest Park**: "draw the Art Museum", "draw the Grand Basin", "draw the trees in Forest Park"
- **Gateway Arch**: "draw the Arch from below", "draw the Arch at sunset", "draw the Arch with people"
- **Mississippi Riverfront**: "draw the Mississippi River", "draw the riverboats", "draw the Eads Bridge"
- **Tower Grove Park**: "draw the Victorian pavilions", "draw the flower gardens", "draw the bandstand"
- **Laclede's Landing**: "draw the cobblestone streets", "draw the historic buildings", "draw the nightlife scene"
- **Soulard Market**: "draw the market vendors", "draw the fresh produce", "draw the market crowds"
- **Cathedral Basilica**: "draw the cathedral dome", "draw the cathedral spires", "draw the cathedral doors"
- **City Museum**: "draw the museum exterior", "draw the museum at night", "draw the museum entrance"
- **Union Station**: "draw the station building", "draw the station clock tower", "draw the station entrance"
- **The Hill**: "draw the Italian restaurants", "draw the neighborhood streets", "draw a restaurant sign"

## 🛠 Technical Requirements

### Database Schema
- **Prompts table** with categories, requirements, location_id, and metadata
- **Locations table** with coordinates, names, and detection radius
- **Gallery images table** for community and user artwork
- **User sessions table** for prompt history and randomization

### API Endpoints
- `GET /api/prompts/random?location_id=123` - Get random prompt (location-specific or generic)
- `GET /api/locations/nearby?lat=38.6386&lng=-90.2847` - Find nearby St. Louis locations
- `GET /api/locations/slug/forest-park` - Get location by slug (for URL override)
- `GET /api/gallery/random` - Get random gallery image for prompts
- `POST /api/gallery/upload` - Upload user artwork to gallery
- `GET /api/shapes/generate` - Generate organic shape for completion prompts

### Frontend Changes
- Remove mode selector UI
- Add single refresh button
- Integrate shape generator for completion prompts
- Add gallery image loading for relevant prompts
- Add location detection with opt-in permission request
- Add URL parameter override for location testing
- Update prompt display system with location context

## 📊 Success Metrics

### Engagement Metrics
- **Session duration** - Time spent per creative session
- **Prompts completed** - Number of prompts completed per session
- **Return rate** - Daily/weekly active users
- **Gallery interactions** - Usage of community/user gallery features

### Creative Metrics
- **Prompt variety** - Distribution of prompt categories used
- **Completion rate** - Percentage of prompts completed vs. refreshed
- **Gallery contributions** - User-generated content added to gallery

### User Experience Metrics
- **Time to first draw** - Speed from app open to first stroke
- **User satisfaction** - Feedback on prompt quality and variety
- **Feature adoption** - Usage of different prompt categories

## 🚀 Implementation Phases

### Phase 1: Core Simplification (Week 1-2)
- Remove mode selector
- Implement single refresh button
- Update prompt system with new categories
- Basic randomization logic

### Phase 2: Shape Integration (Week 3-4)
- Integrate shape generator with completion prompts
- Automatic shape generation for relevant prompts
- Shape-prompt matching logic

### Phase 3: Gallery Integration (Week 5-6)
- Community gallery implementation
- User gallery integration
- Smart image selection for prompts
- Gallery contribution system

### Phase 4: Polish & Optimization (Week 7-8)
- Performance optimization
- User testing and feedback
- Prompt quality refinement
- Analytics implementation

## 🎯 Success Criteria

### MVP Success
- [ ] Users can generate random prompts with single button
- [ ] All 5 prompt categories working
- [ ] Shape generator integrated for completion prompts
- [ ] Basic gallery integration functional
- [ ] No duplicate prompts in sequence

### Full Success
- [ ] 100+ diverse prompts across all categories
- [ ] Active community gallery with quality content
- [ ] Seamless user experience with <2s prompt generation
- [ ] 80%+ user satisfaction with prompt quality
- [ ] 50%+ increase in session duration vs. v1

---

**This PRD represents a significant evolution of Driftpad from a multi-mode drawing app to a focused, prompt-driven creative experience that removes barriers to artistic expression.**
