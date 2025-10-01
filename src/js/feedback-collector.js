// Feedback Collection System for Driftpad
// Handles micro-surveys, session tracking, and user feedback

class FeedbackCollector {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userUUID = this.getUserUUID();
    this.sessionStartTime = Date.now();
    this.drawingCount = 0;
    this.modeSwitches = 0;
    this.currentDrawingId = null; // Track current drawing being worked on
    this.sessionData = {
      modes_used: new Set(),
      tools_used: new Set(),
      drawings_completed: 0,
      session_duration: 0
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
    // Create session in Supabase
    this.createSession();
    
    // Track page visibility changes for session duration
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackSessionEnd();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });

    console.log('FeedbackCollector initialized with session:', this.sessionId, 'user:', this.userUUID);
  }

  // Create session in Supabase
  async createSession() {
    try {
      if (typeof supabase !== 'undefined') {
        const { data, error } = await supabase
          .from('user_sessions')
          .insert([{
            session_id: this.sessionId,
            user_uuid: this.userUUID,
            user_agent: navigator.userAgent,
            started_at: new Date().toISOString()
          }]);

        if (error) {
          console.error('Session creation error:', error);
        } else {
          console.log('Session created successfully:', this.sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Submit feedback to Supabase
  async submitFeedback(type, response, metadata = {}) {
    const feedbackData = {
      type: type,
      response: response,
      session_id: this.sessionId,
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

  // Micro-survey system
  showMicroSurvey(question, options, type, metadata = {}) {
    // Only show surveys 30% of the time to avoid overwhelming users
    if (Math.random() > 0.3) return;

    // Create survey modal
    const surveyModal = document.createElement('div');
    surveyModal.className = 'micro-survey-modal';
    surveyModal.innerHTML = `
      <div class="micro-survey-content">
        <h3>${question}</h3>
        <div class="survey-options">
          ${options.map(option => 
            `<button class="survey-option" data-response="${option}">${option}</button>`
          ).join('')}
        </div>
        <button class="survey-skip">Skip</button>
      </div>
    `;

    // Add styles
    surveyModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1002;
    `;

    const content = surveyModal.querySelector('.micro-survey-content');
    content.style.cssText = `
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;

    // Add event listeners
    surveyModal.querySelectorAll('.survey-option').forEach(button => {
      button.addEventListener('click', (e) => {
        const response = e.target.dataset.response;
        this.submitFeedback(type, response, metadata);
        document.body.removeChild(surveyModal);
        
        // Show thank you toast
        if (typeof window.showToast === 'function') {
          window.showToast('Thanks for your feedback! 🌊');
        }
      });
    });

    surveyModal.querySelector('.survey-skip').addEventListener('click', () => {
      document.body.removeChild(surveyModal);
    });

    // Auto-close after 10 seconds
    setTimeout(() => {
      if (document.body.contains(surveyModal)) {
        document.body.removeChild(surveyModal);
      }
    }, 10000);

    document.body.appendChild(surveyModal);
  }

  // Track drawing completion
  trackDrawingCompleted(mode, duration, strokeCount) {
    this.drawingCount++;
    this.sessionData.drawings_completed++;
    this.sessionData.modes_used.add(mode);

    // Show micro-survey after first drawing
    if (this.drawingCount === 1) {
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

  // Track session end
  async trackSessionEnd() {
    const sessionDuration = Math.round((Date.now() - this.sessionStartTime) / 1000);
    this.sessionData.session_duration = sessionDuration;

    // Update session in Supabase
    try {
      if (typeof supabase !== 'undefined') {
        const { error } = await supabase
          .from('user_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: sessionDuration
          })
          .eq('session_id', this.sessionId);

        if (error) {
          console.error('Session update error:', error);
        } else {
          console.log('Session ended successfully:', this.sessionId);
        }
      }
    } catch (error) {
      console.error('Failed to update session:', error);
    }

    // Show session end survey
    this.showMicroSurvey(
      "One word to describe your drift?",
      ["Peaceful", "Creative", "Focused", "Relaxing", "Inspiring", "Other"],
      "session_end_mood",
      this.sessionData
    );

    // Submit session data
    this.submitFeedback('session_end', 'session_completed', {
      ...this.sessionData,
      modes_used: Array.from(this.sessionData.modes_used),
      tools_used: Array.from(this.sessionData.tools_used),
      session_duration: sessionDuration
    });

    if (typeof umami !== 'undefined') {
      umami.track('session_ended', {
        duration: sessionDuration,
        drawings: this.drawingCount,
        mode_switches: this.modeSwitches,
        modes_used: Array.from(this.sessionData.modes_used)
      });
    }
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
