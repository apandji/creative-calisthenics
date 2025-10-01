# Drift-Inspired Feature Requirements

## Overview
Implementing Situationist dérive principles to make each drawing session feel like a unique journey through serendipity, discovery, and atmospheric changes.

## Feature 1: Dynamic Seasonal Color Palettes

### Description
Color palettes that change based on season, time of day, and session randomization while maintaining zen/calming aesthetics.

### Requirements

#### Seasonal Variations
- **Spring**: Soft pastels, light greens, gentle pinks, warm whites
- **Summer**: Bright but muted tones, ocean blues, sunset oranges, sage greens
- **Autumn**: Earthy tones, warm browns, deep oranges, muted reds
- **Winter**: Cool tones, deep blues, silvers, soft grays

#### Time-Based Variations
- **Morning (6-11 AM)**: Lighter, more energetic palettes
- **Afternoon (12-5 PM)**: Balanced, neutral palettes
- **Evening (6-9 PM)**: Warmer, more intimate palettes
- **Night (10 PM-5 AM)**: Darker, more contemplative palettes

#### Session Randomization
- **Session ID**: Generate unique session identifier
- **Palette Shifts**: Subtle variations within seasonal theme
- **Color Order**: Randomize order of colors in palette
- **Intensity**: Slight variations in saturation/brightness

#### Zen Aesthetic Constraints
- **Saturation Range**: 20-60% (never too vibrant)
- **Brightness Range**: 40-80% (never too dark or bright)
- **Color Harmony**: All colors must work together harmoniously
- **Calming Effect**: Colors should promote relaxation and focus

### Technical Implementation
- **Season Detection**: JavaScript Date object + location (optional)
- **Time Detection**: JavaScript Date object
- **Session ID**: `crypto.randomUUID()` or timestamp-based
- **Color Generation**: HSL color space for easy manipulation
- **Palette Storage**: Array of 5-7 colors per palette

### Acceptance Criteria
- [ ] Palette changes automatically based on season
- [ ] Palette shifts based on time of day
- [ ] Each session has unique color variations
- [ ] All palettes maintain zen/calming aesthetic
- [ ] Color transitions are smooth and natural
- [ ] No jarring or discordant color combinations

---

## Feature 2: Session-Unique Starting Conditions

### Description
Randomize brush size, color, and prompt mode when user starts a new session to create unique journey feel.

### Requirements

#### Brush Size Randomization
- **Range**: 8-25 (reasonable drawing range)
- **Distribution**: Weighted toward middle range (12-18)
- **Session Persistence**: Same size throughout session
- **Visual Feedback**: Cursor size updates immediately

#### Color Randomization
- **Selection**: Random color from current seasonal palette
- **Visual Feedback**: Color button shows as active
- **Brush Update**: Watercolor brush uses selected color
- **Session Persistence**: Same color throughout session

#### Prompt Mode Randomization
- **Modes**: Prompt, Complete Drawing, Freehand
- **Distribution**: Equal probability (33% each)
- **Visual Feedback**: Mode selector shows selected mode
- **Prompt Generation**: Load appropriate prompt for selected mode

#### Session Persistence
- **Duration**: Settings persist for entire session
- **Reset**: New randomization on page refresh/reload
- **Memory**: Store in sessionStorage for consistency

### Technical Implementation
- **Random Generation**: `Math.random()` with weighted distributions
- **Session Storage**: `sessionStorage` for persistence
- **State Management**: Update existing brush and prompt systems
- **UI Updates**: Reflect changes in interface immediately

### Acceptance Criteria
- [ ] Brush size randomizes on session start
- [ ] Color randomizes from current palette
- [ ] Prompt mode randomizes on session start
- [ ] Settings persist throughout session
- [ ] New randomization on page refresh
- [ ] UI reflects randomized settings immediately

---

## Feature 3: Dynamic Canvas Background

### Description
Canvas background color changes slightly in saturation to create atmospheric variation while maintaining drawing surface integrity.

### Requirements

#### Background Variations
- **Base Color**: Maintain current gradient (#d2d2d2 to #f3f3f3)
- **Saturation Shifts**: ±10-15% saturation variation
- **Hue Shifts**: Subtle hue variations (±5-10 degrees)
- **Brightness**: Maintain readability for drawing

#### Atmospheric Factors
- **Seasonal Influence**: Warmer tones in autumn, cooler in winter
- **Time Influence**: Slightly warmer in evening, cooler in morning
- **Session Influence**: Unique background per session
- **Drawing Influence**: Background might respond to drawing patterns

#### Visual Constraints
- **Contrast**: Maintain sufficient contrast for drawing visibility
- **Subtlety**: Changes should be atmospheric, not distracting
- **Consistency**: Background should feel intentional, not random
- **Performance**: Changes should not impact drawing performance

### Technical Implementation
- **Color Space**: HSL for easy saturation manipulation
- **Gradient Generation**: Dynamic gradient creation
- **Canvas Styling**: CSS or Canvas API for background
- **Animation**: Smooth transitions between variations

### Acceptance Criteria
- [ ] Canvas background varies subtly per session
- [ ] Saturation changes are atmospheric, not jarring
- [ ] Drawing visibility maintained across all variations
- [ ] Background feels intentional and calming
- [ ] Performance impact is minimal
- [ ] Transitions are smooth and natural

---

## Implementation Priority

### Phase 1 (Weekend 1)
1. **Session-Unique Starting Conditions** - Highest impact, lowest effort
2. **Basic Dynamic Color Palettes** - Seasonal variations only

### Phase 2 (Weekend 2)
3. **Advanced Color Palettes** - Time-based and session variations
4. **Dynamic Canvas Background** - Subtle atmospheric changes

### Phase 3 (Future)
5. **Advanced Canvas Interactions** - Background responding to drawing
6. **Gesture Unlocks** - Hidden features and discoveries

---

## Technical Considerations

### Performance
- **Color Calculations**: Pre-calculate palettes, cache results
- **Canvas Updates**: Minimize redraws, use efficient rendering
- **Memory Usage**: Store only necessary session data

### User Experience
- **Loading States**: Show palette generation progress
- **Smooth Transitions**: Animate color changes
- **Consistency**: Maintain zen aesthetic across all variations

### Testing
- **Cross-Season Testing**: Test all seasonal variations
- **Time-Based Testing**: Test different times of day
- **Session Testing**: Verify randomization works consistently
- **Aesthetic Testing**: Ensure all combinations feel zen

---

## Success Metrics

### User Engagement
- **Session Duration**: Longer sessions indicate more engaging experience
- **Return Visits**: Users coming back to experience new variations
- **Color Usage**: Users exploring different colors in each session

### Aesthetic Quality
- **User Feedback**: Positive responses to atmospheric changes
- **Visual Harmony**: No jarring or discordant combinations
- **Zen Experience**: Users report feeling calm and focused

### Technical Performance
- **Load Time**: No significant impact on app performance
- **Smooth Operation**: No glitches or visual artifacts
- **Cross-Platform**: Works consistently across devices

---

## Future Enhancements

### Advanced Atmospheric Features
- **Weather Integration**: Real weather data influencing palettes
- **Mood Detection**: User behavior influencing color choices
- **Collaborative Atmospheres**: Shared atmospheric states

### Discovery Features
- **Hidden Palettes**: Special palettes unlocked through gestures
- **Seasonal Surprises**: Unexpected elements during season changes
- **Time-Based Discoveries**: Special features at specific times

### Personalization
- **User Preferences**: Learning from user color choices
- **Adaptive Palettes**: Palettes that evolve with user behavior
- **Personal Atmospheres**: Unique combinations for each user
