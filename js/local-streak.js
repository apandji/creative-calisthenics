// Local Storage Streak Manager for Driftpad
// No user IDs required - completely anonymous and privacy-first

class LocalStreakManager {
  constructor() {
    this.storageKey = 'driftpad_streak';
    this.milestonesKey = 'driftpad_milestones';
    this.historyKey = 'driftpad_daily_history';
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    this.currentStreak = 0;
    this.longestStreak = 0;
    this.lastDrawingDate = null;
    this.totalDrawings = 0;
    this.streakStartDate = null;
    
    this.initialize();
  }

  initialize() {
    try {
      const existingData = this.getStreakData();
      if (!existingData) {
        this.createNewStreak();
      } else {
        this.loadStreakData(existingData);
      }
      this.checkStreakReset();
      this.updateUI();
    } catch (error) {
      console.error('Streak initialization failed:', error);
      this.createNewStreak();
    }
  }

  getStreakData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load streak data:', error);
      return null;
    }
  }

  createNewStreak() {
    const newStreak = {
      currentStreak: 0,
      longestStreak: 0,
      lastVisitDate: null,
      totalVisits: 0,
      streakStartDate: null,
      timezone: this.timezone,
      createdAt: new Date().toISOString()
    };
    
    this.saveStreakData(newStreak);
    this.loadStreakData(newStreak);
  }

  loadStreakData(data) {
    this.currentStreak = data.currentStreak || 0;
    this.longestStreak = data.longestStreak || 0;
    this.lastVisitDate = data.lastVisitDate || data.lastDrawingDate; // Support old data
    this.totalVisits = data.totalVisits || data.totalDrawings || 0; // Support old data
    this.streakStartDate = data.streakStartDate;
  }

  saveStreakData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }

  checkStreakReset() {
    if (this.lastVisitDate) {
      const now = new Date();
      const lastVisitTime = new Date(this.lastVisitDate);
      const hoursSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60);
      
      console.log('Checking streak reset:');
      console.log('  lastVisitDate:', this.lastVisitDate);
      console.log('  hoursSinceLastVisit:', hoursSinceLastVisit);
      console.log('  currentStreak before:', this.currentStreak);
      
      if (hoursSinceLastVisit >= 24) {
        // Streak expired - reset to 0
        console.log('Streak expired - resetting to 0');
        this.currentStreak = 0;
        this.streakStartDate = null;
        this.saveCurrentState();
      } else {
        console.log('Streak still active');
      }
    } else {
      console.log('No lastVisitDate found');
    }
  }

  updateStreak() {
    const now = new Date();
    const lastVisitTime = this.lastVisitDate ? new Date(this.lastVisitDate) : null;
    
    // Check if 24 hours have passed since last visit
    const hoursSinceLastVisit = lastVisitTime ? 
      (now - lastVisitTime) / (1000 * 60 * 60) : 24; // If no previous visit, treat as 24+ hours
    
    if (hoursSinceLastVisit >= 24 || this.currentStreak === 0) {
      // Reset streak after 24 hours OR start first streak
      this.currentStreak = 1; // Start fresh with 1
      this.streakStartDate = now.toISOString();
    } else {
      // Increment streak within 24 hours
      this.currentStreak += 1;
    }
    
    // Always increment total visits
    this.totalVisits += 1;
    
    // Update longest streak if needed
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }

    // Update last visit time
    this.lastVisitDate = now.toISOString();
    
    // Save to localStorage
    this.saveCurrentState();
    
    // Update daily history
    this.updateDailyHistory(now.toISOString().split('T')[0]);
    
    // Check for milestones
    this.checkMilestones();
    
    this.updateUI();
  }

  saveCurrentState() {
    const data = {
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      lastVisitDate: this.lastVisitDate,
      totalVisits: this.totalVisits,
      streakStartDate: this.streakStartDate,
      timezone: this.timezone,
      updatedAt: new Date().toISOString()
    };
    
    this.saveStreakData(data);
  }

  updateDailyHistory(date) {
    try {
      const history = JSON.parse(localStorage.getItem(this.historyKey) || '{}');
      history[date] = true;
      
      // Keep only last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
      
      Object.keys(history).forEach(key => {
        if (key < cutoffDate) {
          delete history[key];
        }
      });
      
      localStorage.setItem(this.historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to update daily history:', error);
    }
  }

  checkMilestones() {
    const milestones = [3, 7, 14, 30, 60, 100];
    const achievedMilestone = milestones.find(m => this.currentStreak === m);
    
    if (achievedMilestone) {
      this.recordMilestone(achievedMilestone);
    }
  }

  recordMilestone(milestone) {
    try {
      const milestones = JSON.parse(localStorage.getItem(this.milestonesKey) || '[]');
      if (!milestones.includes(milestone)) {
        milestones.push(milestone);
        localStorage.setItem(this.milestonesKey, JSON.stringify(milestones));
      }
    } catch (error) {
      console.error('Failed to record milestone:', error);
    }
  }

  getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  getYesterdayString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  updateUI() {
    this.updateStreakIndicator();
  }

  updateStreakIndicator() {
    const indicator = document.getElementById('streak-indicator');
    if (!indicator) {
      return;
    }

    if (this.currentStreak > 0) {
      indicator.textContent = `🔥 ${this.currentStreak}`;
      indicator.className = 'streak-indicator active';
    } else {
      indicator.textContent = '🌊 0';
      indicator.className = 'streak-indicator inactive';
    }
  }


  getStreakStats() {
    return {
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      totalVisits: this.totalVisits,
      lastVisitDate: this.lastVisitDate,
      streakStartDate: this.streakStartDate
    };
  }

  resetStreak() {
    this.currentStreak = 0;
    this.streakStartDate = null;
    this.saveCurrentState();
    this.updateUI();
  }
}

// Initialize when DOM is loaded
function initializeStreakManager() {
  if (!window.localStreakManager) {
    window.localStreakManager = new LocalStreakManager();
    console.log('Streak manager initialized:', window.localStreakManager);
    console.log('Streak manager current streak:', window.localStreakManager.currentStreak);
  } else {
    console.log('Streak manager already exists:', window.localStreakManager);
  }
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStreakManager);
} else {
  // DOM is already ready
  initializeStreakManager();
}

// Fallback initialization
setTimeout(initializeStreakManager, 1000);
