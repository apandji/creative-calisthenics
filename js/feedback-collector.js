// Feedback Collection System for Driftpad
// Handles micro-surveys, session tracking, and user feedback

class FeedbackCollector {
  constructor() {
    this.userUUID = this.getUserUUID();
    this.drawingCount = 0;
    this.modeSwitches = 0;
    this.currentDrawingId = null; // Track current drawing being worked on
    this.sessionData = {
      modes_used: new Set(),
      tools_used: new Set(),
      drawings_completed: 0
    };
    
    this.init();
  }

  getUserUUID() {
    let userUUID = localStorage.getItem('user_uuid');
    if (!userUUID) {
      userUUID = crypto.randomUUID();
      localStorage.setItem('user_uuid', userUUID);
    }
    return userUUID;
  }

  init() {
    console.log('FeedbackCollector initialized for user:', this.userUUID);
  }


  // Submit feedback to Supabase
  async submitFeedback(type, response, metadata = {}) {
    const feedbackData = {
      type: type,
      response: response,
      user_uuid: this.userUUID,
      drawing_id: this.currentDrawingId, // Link to current drawing if applicable
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };

    try {
      // Check if Supabase is available
      if (typeof supabase !== 'undefined') {
        const { data, error } = await supabase
          .from('feedback')
          .insert([feedbackData]);

        if (error) {
          console.error('Feedback submission error:', error);
          // Fallback to localStorage
          this.storeFeedbackLocally(feedbackData);
        } else {
          console.log('Feedback submitted successfully:', type, response);
        }
      } else {
        console.warn('Supabase not available, storing locally');
        this.storeFeedbackLocally(feedbackData);
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      this.storeFeedbackLocally(feedbackData);
    }
  }

  // Fallback storage in localStorage
  storeFeedbackLocally(feedbackData) {
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('driftpad_feedback') || '[]');
      existingFeedback.push(feedbackData);
      localStorage.setItem('driftpad_feedback', JSON.stringify(existingFeedback));
      console.log('Feedback stored locally:', feedbackData.type);
    } catch (error) {
      console.error('Failed to store feedback locally:', error);
    }
  }

  // Micro-survey system - now using toasts
  showMicroSurvey(question, options, type, metadata = {}) {
    console.log(`showMicroSurvey called: ${question}`);
    
    // Only show surveys 80% of the time for testing (was 30%)
    const shouldShow = Math.random() <= 0.8;
    console.log(`Should show survey: ${shouldShow}`);
    
    if (!shouldShow) return;

    // Show the question as a toast
    if (typeof window.showToast === 'function') {
      console.log('Showing toast:', question);
      window.showToast(question);
    } else {
      console.log('showToast function not available');
    }
    
    // Simulate a response after a short delay
    // In a real implementation, you could show interactive toasts with buttons
    setTimeout(() => {
      if (options) {
        console.log(`Micro-Survey: ${question}`);
        console.log('Options:', options.join(', '));
        // Simulate a random response for testing
        const simulatedResponse = options[Math.floor(Math.random() * options.length)];
        this.submitFeedback('micro_survey', simulatedResponse, {
          question: question,
          type: type,
          ...metadata
        });
      } else {
        // Simulate a text response
        const simulatedResponse = "User provided feedback.";
        this.submitFeedback('micro_survey', simulatedResponse, {
          question: question,
          type: type,
          ...metadata
        });
      }
    }, 2000); // Wait 2 seconds to simulate user interaction
  }

  // Track drawing completion
  trackDrawingCompleted(mode, duration, strokeCount) {
    this.drawingCount++;
    this.sessionData.drawings_completed++;
    this.sessionData.modes_used.add(mode);

    console.log(`Drawing completed! Count: ${this.drawingCount}, Mode: ${mode}`);

    // Show micro-survey after first drawing
    if (this.drawingCount === 1) {
      console.log('Triggering first drawing survey...');
      setTimeout(() => {
        this.showMicroSurvey(
          "How did that feel?",
          ["Amazing", "Good", "Okay", "Meh"],
          "first_drawing_feeling",
          { mode, duration, strokeCount }
        );
      }, 2000);
    }

    // Track in analytics
    if (typeof umami !== 'undefined') {
      umami.track('drawing_completed', { 
        mode, 
        duration, 
        strokeCount,
        session_drawings: this.drawingCount 
      });
    }

    this.submitFeedback('drawing_completed', 'completed', {
      mode,
      duration,
      strokeCount,
      session_drawings: this.drawingCount
    });
  }

  // Track mode switching
  trackModeSwitch(from, to) {
    this.modeSwitches++;
    this.sessionData.modes_used.add(to);

    // Show micro-survey occasionally
    if (this.modeSwitches % 3 === 0) {
      setTimeout(() => {
        this.showMicroSurvey(
          "Which mode do you prefer?",
          ["Normal", "Complete", "Drift"],
          "mode_preference",
          { from, to, total_switches: this.modeSwitches }
        );
      }, 1000);
    }

    // Track in analytics
    if (typeof umami !== 'undefined') {
      umami.track('mode_switched', { from, to, total_switches: this.modeSwitches });
    }

    this.submitFeedback('mode_switched', `${from} -> ${to}`, {
      from,
      to,
      total_switches: this.modeSwitches
    });
  }

  // Track tool usage
  trackToolUsage(tool) {
    this.sessionData.tools_used.add(tool);

    if (typeof umami !== 'undefined') {
      umami.track('tool_used', { tool });
    }
  }

  // Track drawing ID when a drawing is submitted
  trackDrawingSubmitted(drawingId) {
    this.currentDrawingId = drawingId;
    console.log('Drawing submitted with ID:', drawingId);
  }


  // Get feedback data from localStorage (for debugging)
  getLocalFeedback() {
    try {
      return JSON.parse(localStorage.getItem('driftpad_feedback') || '[]');
    } catch (error) {
      console.error('Failed to get local feedback:', error);
      return [];
    }
  }

  // Clear local feedback (for testing)
  clearLocalFeedback() {
    localStorage.removeItem('driftpad_feedback');
    console.log('Local feedback cleared');
  }
}

// Initialize feedback collector
window.feedbackCollector = new FeedbackCollector();

// Make it globally available
window.FeedbackCollector = FeedbackCollector;
