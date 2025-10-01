// Watercolor Brush System
// Provides natural watercolor effects with wet-on-wet blending and texture variation

class WatercolorBrush {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.currentColor = '#000000';
    this.brushSize = 10; // Default to 25% of max (40 * 0.25 = 10)
    this.wetness = 0.3; // Reduced for Sumi ink - less blending
    this.flow = 0.4; // Reduced for more controlled ink flow
    this.fadeTimer = null; // Reference to fade timer for opacity
    
    // Watercolor-specific properties
    this.paintLayers = []; // Store wet paint for blending
    this.maxLayers = 8; // Maximum wet layers before drying - reduced for performance
    this.dryTime = 4000; // Time for paint to dry (ms) - reduced for better performance
    this.blendRadius = 20; // Radius for wet-on-wet blending - reduced for performance
    
    // Sumi ink color palette - 5 precise tones
    this.zenColors = [
      '#000000', // 100% black
      '#333333', // 80% black
      '#666666', // 60% black
      '#999999', // 40% black
      '#E6E6E6'  // 10% black
    ];
    
    this.currentColorIndex = 0;
    this.currentColor = this.zenColors[0];
  }

  // Set brush color from zen palette
  setColor(colorIndex) {
    if (colorIndex >= 0 && colorIndex < this.zenColors.length) {
      this.currentColorIndex = colorIndex;
      this.currentColor = this.zenColors[colorIndex];
    }
  }

  // Set brush size
  setSize(size) {
    this.brushSize = Math.max(1, Math.min(40, size));
  }

  // Start drawing stroke
  startStroke(x, y, pressure = 0.5) {
    this.isDrawing = true;
    this.lastX = x;
    this.lastY = y;
    
    // Create initial paint drop
    this.addPaintDrop(x, y, pressure);
  }

  // Continue drawing stroke
  continueStroke(x, y, pressure = 0.5) {
    if (!this.isDrawing) return;
    
    // Add paint along the stroke path
    this.addPaintDrop(x, y, pressure);
    
    // Create connecting stroke between points
    this.createStroke(this.lastX, this.lastY, x, y, pressure);
    
    this.lastX = x;
    this.lastY = y;
  }

  // End drawing stroke
  endStroke() {
    this.isDrawing = false;
  }

  // Add a paint drop at position (Smooth calligraphic style)
  addPaintDrop(x, y, pressure) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(pressure) || !isFinite(this.brushSize) || this.brushSize <= 0) {
      return;
    }
    
    // Calligraphy: Very sensitive to pressure
    if (pressure < 0.02) return;
    
    // Smooth pressure response for calligraphy
    const pressureMultiplier = Math.pow(pressure, 0.8); // Smoother curve
    const sizeVariation = 0.3 + pressureMultiplier * 1.4; // Less dramatic size variation
    const opacityVariation = 0.4 + pressureMultiplier * 0.6; // Less dramatic opacity variation
    
    // Validate calculated values
    if (!isFinite(pressureMultiplier) || !isFinite(sizeVariation) || !isFinite(opacityVariation) || sizeVariation <= 0) {
      return;
    }
    
    const calculatedSize = this.brushSize * sizeVariation;
    if (!isFinite(calculatedSize) || calculatedSize <= 0) {
      return;
    }
    
    const paintDrop = {
      x: x,
      y: y,
      color: this.currentColor,
      size: calculatedSize,
      opacity: opacityVariation,
      wetness: this.wetness,
      timestamp: Date.now(),
      flow: this.flow,
      pressure: pressure,
      pressureMultiplier: pressureMultiplier
    };
    
    this.paintLayers.push(paintDrop);
    
    // Limit number of wet layers
    if (this.paintLayers.length > this.maxLayers) {
      this.paintLayers.shift();
    }
    
    // Render calligraphic ink style
    this.renderCalligraphicInkDrop(paintDrop);
    
    // Minimal blending for calligraphy
    if (pressure > 0.8) {
      this.blendWetPaint(paintDrop);
    }
  }

  // Create stroke between two points (Smooth calligraphic style)
  createStroke(x1, y1, x2, y2, pressure) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2) || !isFinite(pressure)) {
      return;
    }
    
    const distance = Math.hypot(x2 - x1, y2 - y1);
    if (!isFinite(distance) || distance <= 0) {
      return;
    }
    
    const steps = Math.max(2, Math.floor(distance / 1)); // Very dense for smoothness
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      
      // Validate calculated coordinates
      if (!isFinite(x) || !isFinite(y)) {
        continue;
      }
      
      // Smooth pressure variation with minimal randomness
      const strokeVariation = Math.sin(t * Math.PI) * 0.05; // Reduced variation
      const randomVariation = (Math.random() - 0.5) * 0.1; // Much less randomness
      const variedPressure = Math.max(0.2, Math.min(1, pressure + strokeVariation + randomVariation));
      
      // Validate pressure
      if (!isFinite(variedPressure) || variedPressure <= 0) {
        continue;
      }
      
      // Smooth perpendicular offset for brush width
      const brushWidth = this.brushSize * (0.3 + variedPressure * 1.4);
      const perpX = (y2 - y1) / distance * (Math.random() - 0.5) * brushWidth * 0.15; // Reduced offset
      const perpY = (x1 - x2) / distance * (Math.random() - 0.5) * brushWidth * 0.15; // Reduced offset
      
      // Validate offset calculations
      if (!isFinite(perpX) || !isFinite(perpY)) {
        continue;
      }
      
      this.addPaintDrop(x + perpX, y + perpY, variedPressure);
    }
  }

  // Render calligraphic ink drop with enhanced brush behavior
  renderCalligraphicInkDrop(paintDrop) {
    const { x, y, color, size, opacity, pressure, pressureMultiplier } = paintDrop;
    
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    this.ctx.save();
    
    // Apply fade opacity to the entire stroke
    const fadeOpacity = this.getFadeOpacity();
    this.ctx.globalAlpha = fadeOpacity;
    
    // Enhanced calligraphic brush: More pronounced elliptical shape
    const aspectRatio = 0.2 + pressureMultiplier * 0.8; // More dramatic elliptical change
    const brushWidth = size * aspectRatio;
    const brushHeight = size;
    
    // Validate calculated values
    if (!isFinite(brushWidth) || !isFinite(brushHeight) || brushWidth <= 0 || brushHeight <= 0) {
      this.ctx.restore();
      return;
    }
    
    // Create smooth elliptical gradient for calligraphic feel with layering support
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(0.3, this.hexToRgba(color, opacity * 0.9));
    gradient.addColorStop(0.6, this.hexToRgba(color, opacity * 0.7));
    gradient.addColorStop(0.8, this.hexToRgba(color, opacity * 0.4));
    gradient.addColorStop(1, this.hexToRgba(color, opacity * 0.1));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, brushWidth, brushHeight, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add subtle calligraphic texture for brush feel (reduced for smoothness)
    if (size > 6 && pressure > 0.3) {
      this.addSmoothCalligraphicTexture(x, y, brushWidth, brushHeight, color, opacity * 0.2);
    }
    
    // Add brush stroke direction indicator for light pressure
    if (pressure < 0.4 && size > 8) {
      this.addBrushDirection(x, y, brushWidth, brushHeight, color, opacity * 0.15);
    }
    
    this.ctx.restore();
  }

  // Add smooth calligraphic texture variation
  addSmoothCalligraphicTexture(x, y, width, height, color, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      return;
    }
    
    const textureCount = Math.min(1, Math.floor(width / 4)); // Reduced texture
    
    for (let i = 0; i < textureCount; i++) {
      const angle = (Math.PI * i) / textureCount;
      const radiusX = Math.random() * width * 0.4; // Reduced radius
      const radiusY = Math.random() * height * 0.4; // Reduced radius
      const textureX = x + Math.cos(angle) * radiusX;
      const textureY = y + Math.sin(angle) * radiusY;
      const textureWidth = Math.random() * width * 0.2; // Smaller texture
      const textureHeight = Math.random() * height * 0.2; // Smaller texture
      
      // Validate calculated values
      if (!isFinite(textureX) || !isFinite(textureY) || !isFinite(textureWidth) || !isFinite(textureHeight) || textureWidth <= 0 || textureHeight <= 0) {
        continue;
      }
      
      this.ctx.fillStyle = this.hexToRgba(color, opacity);
      this.ctx.beginPath();
      this.ctx.ellipse(textureX, textureY, textureWidth, textureHeight, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Add calligraphic texture variation (legacy)
  addCalligraphicTexture(x, y, width, height, color, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      return;
    }
    
    const textureCount = Math.min(2, Math.floor(width / 3));
    
    for (let i = 0; i < textureCount; i++) {
      const angle = (Math.PI * i) / textureCount;
      const radiusX = Math.random() * width * 0.6;
      const radiusY = Math.random() * height * 0.6;
      const textureX = x + Math.cos(angle) * radiusX;
      const textureY = y + Math.sin(angle) * radiusY;
      const textureWidth = Math.random() * width * 0.3;
      const textureHeight = Math.random() * height * 0.3;
      
      // Validate calculated values
      if (!isFinite(textureX) || !isFinite(textureY) || !isFinite(textureWidth) || !isFinite(textureHeight) || textureWidth <= 0 || textureHeight <= 0) {
        continue;
      }
      
      this.ctx.fillStyle = this.hexToRgba(color, opacity);
      this.ctx.beginPath();
      this.ctx.ellipse(textureX, textureY, textureWidth, textureHeight, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Add brush direction indicator for light strokes
  addBrushDirection(x, y, width, height, color, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      return;
    }
    
    // Create a more calligraphic brush direction indicator
    // Validate parameters for createRadialGradient
    const gradientRadius = height * 0.4;
    if (!isFinite(x) || !isFinite(y) || !isFinite(gradientRadius) || gradientRadius <= 0) {
      this.ctx.restore();
      return;
    }
    
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, gradientRadius);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(0.5, this.hexToRgba(color, opacity * 0.6));
    gradient.addColorStop(1, this.hexToRgba(color, 0));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, width * 0.15, height * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Render Sumi ink drop with calligraphic feel (legacy)
  renderSumiInkDrop(paintDrop) {
    const { x, y, color, size, opacity, pressure } = paintDrop;
    
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    // Sumi ink: Single strong stroke with subtle variation
    this.ctx.save();
    
    // Create ink gradient
    // Validate parameters for createRadialGradient
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      this.ctx.restore();
      return;
    }
    
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(0.8, this.hexToRgba(color, opacity * 0.8));
    gradient.addColorStop(1, this.hexToRgba(color, opacity * 0.3));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add subtle texture for ink feel
    if (size > 6) {
      this.addInkTexture(x, y, size, color, opacity * 0.2);
    }
    
    this.ctx.restore();
  }

  // Add ink texture variation
  addInkTexture(x, y, size, color, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    const textureCount = Math.min(2, Math.floor(size / 6));
    
    for (let i = 0; i < textureCount; i++) {
      const angle = (Math.PI * 2 * i) / textureCount;
      const radius = Math.random() * size * 0.4;
      const textureX = x + Math.cos(angle) * radius;
      const textureY = y + Math.sin(angle) * radius;
      const textureSize = Math.random() * size * 0.2;
      
      // Validate calculated values
      if (!isFinite(textureX) || !isFinite(textureY) || !isFinite(textureSize) || textureSize <= 0) {
        continue;
      }
      
      this.ctx.fillStyle = this.hexToRgba(color, opacity);
      this.ctx.beginPath();
      this.ctx.arc(textureX, textureY, textureSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Render a weighted paint drop with optimized performance (legacy)
  renderWeightedPaintDrop(paintDrop) {
    const { x, y, color, size, opacity, pressure } = paintDrop;
    
    // Optimized: Use fewer layers but with better distribution
    const layers = Math.max(1, Math.floor(pressure * 2) + 1); // Reduced from 4 to 2
    
    for (let i = 0; i < layers; i++) {
      const layerOpacity = opacity * (0.4 + (i / layers) * 0.6);
      const layerSize = size * (0.5 + (i / layers) * 0.7);
      const layerOffset = (Math.random() - 0.5) * size * 0.15; // Reduced offset
      
      this.renderPaintLayer(
        x + layerOffset, 
        y + layerOffset, 
        color, 
        layerSize, 
        layerOpacity
      );
    }
    
    // Add a strong core for weight (only if pressure is high enough)
    if (pressure > 0.5) {
      this.renderPaintCore(x, y, color, size * 0.25, opacity * 1.1);
    }
  }

  // Render a single paint layer
  renderPaintLayer(x, y, color, size, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    // Create gradient for watercolor effect
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(0.6, this.hexToRgba(color, opacity * 0.6));
    gradient.addColorStop(0.8, this.hexToRgba(color, opacity * 0.3));
    gradient.addColorStop(1, this.hexToRgba(color, 0));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Render a strong core for weight
  renderPaintCore(x, y, color, size, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    // Solid core for weight
    this.ctx.fillStyle = this.hexToRgba(color, opacity);
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add subtle highlight
    // Validate parameters for createRadialGradient
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      this.ctx.restore();
      return;
    }
    
    const highlightGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    highlightGradient.addColorStop(0, this.hexToRgba('#ffffff', opacity * 0.2));
    highlightGradient.addColorStop(0.5, this.hexToRgba('#ffffff', opacity * 0.1));
    highlightGradient.addColorStop(1, this.hexToRgba('#ffffff', 0));
    
    this.ctx.fillStyle = highlightGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Render a single paint drop (legacy function for compatibility)
  renderPaintDrop(paintDrop) {
    const { x, y, color, size, opacity, flow } = paintDrop;
    
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    // Create gradient for watercolor effect
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, this.hexToRgba(color, opacity));
    gradient.addColorStop(0.7, this.hexToRgba(color, opacity * 0.5));
    gradient.addColorStop(1, this.hexToRgba(color, 0));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add texture variation
    this.addTextureVariation(x, y, size, color, opacity * 0.3);
  }

  // Blend wet paint with existing wet areas (enhanced for layering)
  blendWetPaint(newDrop) {
    const now = Date.now();
    let blendCount = 0;
    const maxBlends = 4; // Increased for better layering
    
    // Process layers in reverse order (newest first) for better performance
    for (let i = this.paintLayers.length - 1; i >= 0 && blendCount < maxBlends; i--) {
      const layer = this.paintLayers[i];
      
      // Skip if layer is too old
      if (now - layer.timestamp > this.dryTime) continue;
      
      const distance = Math.hypot(newDrop.x - layer.x, newDrop.y - layer.y);
      
      if (distance < this.blendRadius) {
        // Calculate blend strength based on distance and wetness
        const blendStrength = (1 - distance / this.blendRadius) * 
                             Math.min(newDrop.wetness, layer.wetness) * 0.3; // Increased blend strength for layering
        
        if (blendStrength > 0.1) { // Lower threshold for more blending
          this.createBlendEffect(newDrop, layer, blendStrength);
          blendCount++;
        }
      }
    }
  }

  // Create blend effect between two paint drops
  createBlendEffect(drop1, drop2, strength) {
    const midX = (drop1.x + drop2.x) / 2;
    const midY = (drop1.y + drop2.y) / 2;
    const blendSize = (drop1.size + drop2.size) / 2 * strength;
    
    // Blend colors
    const blendedColor = this.blendColors(drop1.color, drop2.color, 0.5);
    const blendedOpacity = (drop1.opacity + drop2.opacity) / 2 * strength;
    
    // Create soft blend gradient
    // Validate parameters for createRadialGradient
    if (!isFinite(midX) || !isFinite(midY) || !isFinite(blendSize) || blendSize <= 0) {
      return;
    }
    
    const gradient = this.ctx.createRadialGradient(midX, midY, 0, midX, midY, blendSize);
    gradient.addColorStop(0, this.hexToRgba(blendedColor, blendedOpacity));
    gradient.addColorStop(0.5, this.hexToRgba(blendedColor, blendedOpacity * 0.5));
    gradient.addColorStop(1, this.hexToRgba(blendedColor, 0));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(midX, midY, blendSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Add texture variation to paint drops with optimized performance
  addTextureVariation(x, y, size, color, opacity) {
    // Validate inputs to prevent non-finite values
    if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
      return;
    }
    
    // Optimized: Reduce texture count and only add for larger brush sizes
    if (size < 8) return; // Skip texture for small brushes
    
    const textureCount = Math.min(3, Math.floor(size / 4)); // Reduced texture count
    
    for (let i = 0; i < textureCount; i++) {
      const angle = (Math.PI * 2 * i) / textureCount;
      const radius = Math.random() * size * 0.6; // Reduced radius
      const textureX = x + Math.cos(angle) * radius;
      const textureY = y + Math.sin(angle) * radius;
      const textureSize = Math.random() * size * 0.3; // Smaller texture elements
      const textureOpacity = opacity * (0.2 + Math.random() * 0.3); // Reduced opacity
      
      // Validate calculated values
      if (!isFinite(textureX) || !isFinite(textureY) || !isFinite(textureSize) || textureSize <= 0) {
        continue;
      }
      
      // Add texture elements
      this.ctx.fillStyle = this.hexToRgba(color, textureOpacity);
      this.ctx.beginPath();
      this.ctx.arc(textureX, textureY, textureSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Convert hex color to rgba
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Blend two hex colors
  blendColors(color1, color2, ratio) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Clear all paint layers
  clear() {
    this.paintLayers = [];
  }

  // Check if there are any user-created strokes
  hasUserStrokes() {
    return this.paintLayers.length > 0;
  }

  // Get all user stroke data for redrawing
  getUserStrokes() {
    return this.paintLayers.slice(); // Return a copy
  }

  // Clear only user strokes (for eraser functionality)
  clearUserStrokes() {
    this.paintLayers = [];
  }

  // Get current zen colors for UI
  getZenColors() {
    return this.zenColors;
  }

  // Set fade timer reference
  setFadeTimer(fadeTimer) {
    this.fadeTimer = fadeTimer;
  }

  // Get current fade opacity
  getFadeOpacity() {
    return this.fadeTimer ? this.fadeTimer.currentFadeOpacity || 1.0 : 1.0;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WatercolorBrush;
} else {
  window.WatercolorBrush = WatercolorBrush;
}
