// Fade Timer System
// Implements 2-hour multi-stage fade with localStorage persistence

class FadeTimer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.fadeDuration = 1 * 60 * 1000; // 1 minute in milliseconds
    this.startTime = null;
    this.isActive = false;
    this.fadeInterval = null;
    
    // Fade stages (like real ink drying) - smooth fade from 1.0 to 0.5
    this.fadeStages = [
      { time: 0, opacity: 1.0, name: 'Fresh' },
      { time: 0.2, opacity: 0.9, name: 'Settling' },
      { time: 0.4, opacity: 0.8, name: 'Drying' },
      { time: 0.6, opacity: 0.7, name: 'Fading' },
      { time: 0.8, opacity: 0.6, name: 'Pale' },
      { time: 1.0, opacity: 0.5, name: 'Memory' }
    ];
    
    this.loadFromStorage();
  }

  // Start the fade timer
  start() {
    this.startTime = Date.now();
    this.isActive = true;
    this.saveToStorage();
    this.startFadeLoop();
  }

  // Stop the fade timer
  stop() {
    this.isActive = false;
    this.startTime = null;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.clearStorage();
  }

  // Get current fade progress (0-1)
  getFadeProgress() {
    if (!this.isActive || !this.startTime) return 0;
    
    const elapsed = Date.now() - this.startTime;
    return Math.min(elapsed / this.fadeDuration, 1);
  }

  // Get current opacity based on fade progress with smooth interpolation
  getCurrentOpacity() {
    const progress = this.getFadeProgress();
    
    // Find the appropriate fade stage
    for (let i = 0; i < this.fadeStages.length - 1; i++) {
      const currentStage = this.fadeStages[i];
      const nextStage = this.fadeStages[i + 1];
      
      if (progress >= currentStage.time && progress <= nextStage.time) {
        // Smooth interpolation between stages
        const stageProgress = (progress - currentStage.time) / (nextStage.time - currentStage.time);
        // Use easing function for smoother transition
        const easedProgress = this.easeInOut(stageProgress);
        return currentStage.opacity + (nextStage.opacity - currentStage.opacity) * easedProgress;
      }
    }
    
    return this.fadeStages[this.fadeStages.length - 1].opacity;
  }

  // Easing function for smooth transitions
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Get current stage name
  getCurrentStageName() {
    const progress = this.getFadeProgress();
    
    for (let i = this.fadeStages.length - 1; i >= 0; i--) {
      if (progress >= this.fadeStages[i].time) {
        return this.fadeStages[i].name;
      }
    }
    
    return this.fadeStages[0].name;
  }

  // Apply smooth fade effect to canvas (ink drying style)
  applyFade() {
    if (!this.isActive) return;
    
    const opacity = this.getCurrentOpacity();
    const stageName = this.getCurrentStageName();
    
    // Store the current fade opacity for the drawing system to use
    this.currentFadeOpacity = opacity;
    
    // Clear and redraw the canvas with the faded opacity
    if (opacity < 1) {
      // Get the current canvas content
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Redraw with faded opacity
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.putImageData(imageData, 0, 0);
      this.ctx.restore();
    }
  }

  // Start the smooth fade loop
  startFadeLoop() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    this.fadeInterval = setInterval(() => {
      this.applyFade();
      
      // Check if fade is complete (but never stop completely)
      if (this.getFadeProgress() >= 1) {
        // Continue with gentle fade instead of stopping
        this.applyFade();
      }
    }, 500); // Update every 500ms for smoother animation
  }

  // Save timer state to localStorage
  saveToStorage() {
    if (this.isActive && this.startTime) {
      const timerData = {
        startTime: this.startTime,
        isActive: this.isActive
      };
      localStorage.setItem('watercolor_fade_timer', JSON.stringify(timerData));
    }
  }

  // Load timer state from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('watercolor_fade_timer');
      if (stored) {
        const timerData = JSON.parse(stored);
        if (timerData.isActive && timerData.startTime) {
          this.startTime = timerData.startTime;
          this.isActive = true;
          
          // Check if timer should still be active
          const elapsed = Date.now() - this.startTime;
          if (elapsed >= this.fadeDuration) {
            // Timer has expired
            this.stop();
          } else {
            // Resume timer
            this.startFadeLoop();
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load fade timer from storage:', error);
      this.clearStorage();
    }
  }

  // Clear timer from localStorage
  clearStorage() {
    localStorage.removeItem('watercolor_fade_timer');
  }

  // Check if timer is active
  isTimerActive() {
    return this.isActive;
  }

  // Get remaining time in milliseconds
  getRemainingTime() {
    if (!this.isActive || !this.startTime) return 0;
    
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.fadeDuration - elapsed);
  }

  // Get remaining time in human-readable format
  getRemainingTimeFormatted() {
    const remaining = this.getRemainingTime();
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FadeTimer;
} else {
  window.FadeTimer = FadeTimer;
}
