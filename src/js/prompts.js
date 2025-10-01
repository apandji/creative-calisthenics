(function () {
  // Wait for DOM to be ready
  function init() {
    const target = document.querySelector('.prompt');
    const modeSelect = document.getElementById('prompt-mode');
    const newPromptBtn = document.getElementById('new-prompt-btn');
    
    console.log('DOM elements found:', { target, modeSelect, newPromptBtn });
    
    if (!target || !modeSelect || !newPromptBtn) {
      console.error('Required DOM elements not found');
      return;
    }

    // Initialize shape generator for complete drawing mode
    let shapeGenerator = null;
    
    // Initialize shape generator when needed
    function initShapeGenerator() {
      if (!shapeGenerator) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          shapeGenerator = new ShapeGenerator(canvas, ctx);
          
          // Make shape generator globally accessible for clear button
          window.shapeGenerator = shapeGenerator;
        } else {
          console.error('Canvas not found for ShapeGenerator');
        }
      }
    }

    // Load prompt from Supabase
    async function loadPrompt(mode = 'prompt') {
      // Loading prompt for mode
      
      // Check if supabase is available
      if (typeof window.supabaseClient === 'undefined') {
        console.error('Supabase client not available, using fallback');
        const fallback = getFallbackPrompt(mode);
        console.log('Using fallback prompt:', fallback);
        return fallback;
      }
      
      try {
        // First try with active filter
        let { data, error } = await window.supabaseClient
          .from('prompts')
          .select('content, weight')
          .eq('type', mode)
          .eq('active', true);
        
        // If no results and no error, try without active filter (in case active column doesn't exist)
        if ((!data || data.length === 0) && !error) {
          const result = await window.supabaseClient
            .from('prompts')
            .select('content, weight')
            .eq('type', mode);
          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error('Error loading prompt from Supabase:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          // Fallback to default prompts
          const fallback = getFallbackPrompt(mode);
          console.log('Using fallback prompt due to Supabase error:', fallback);
          return fallback;
        }

        // Process Supabase response

        if (data && Array.isArray(data) && data.length > 0) {
          // Use weighted selection for freehand mode, simple random for others
          let selectedPrompt;
          if (mode === 'freehand') {
            selectedPrompt = selectWeightedPrompt(data);
          } else {
            const randomIndex = Math.floor(Math.random() * data.length);
            selectedPrompt = data[randomIndex].content;
          }
          console.log(`✅ Loaded prompt from Supabase (${mode}):`, selectedPrompt);
          return selectedPrompt;
        } else {
          const fallback = getFallbackPrompt(mode);
          return fallback;
        }
      } catch (err) {
        console.error('Error:', err);
        const fallback = getFallbackPrompt(mode);
        return fallback;
      }
    }

    // Weighted selection for freehand prompts
    function selectWeightedPrompt(prompts) {
      // Create weighted array where each prompt appears 'weight' times
      const weightedArray = [];
      prompts.forEach(prompt => {
        const weight = prompt.weight || 1;
        for (let i = 0; i < weight; i++) {
          weightedArray.push(prompt.content);
        }
      });
      
      // Select random from weighted array
      const randomIndex = Math.floor(Math.random() * weightedArray.length);
      return weightedArray[randomIndex];
    }

    // Track user behavior for smart prompts
    function trackUserBehavior() {
      const sessionStart = localStorage.getItem('session_start');
      const now = Date.now();
      
      if (!sessionStart) {
        localStorage.setItem('session_start', now);
        return { sessionDuration: 0, promptCount: 0 };
      }
      
      const sessionDuration = (now - parseInt(sessionStart)) / (1000 * 60); // minutes
      const promptCount = parseInt(localStorage.getItem('prompt_count') || '0');
      
      return { sessionDuration, promptCount };
    }

    function updatePromptCount() {
      const current = parseInt(localStorage.getItem('prompt_count') || '0');
      localStorage.setItem('prompt_count', (current + 1).toString());
    }

    // Fallback prompts if Supabase fails
    function getFallbackPrompt(mode) {
      const behavior = trackUserBehavior();
      const { sessionDuration, promptCount } = behavior;
      
      const fallbackPrompts = {
        'prompt': [
          'elephant with a flower hat.',
          'city skyline made of books.',
          'teacup sailing on an ocean of paint.',
          'bicycle that turns into a bird.',
          'tiny astronaut exploring a houseplant.'
        ],
        'complete_drawing': 'complete the drawing.',
        'freehand': [
          'let your mind drift.',
          'take a drink of water.',
          'call a friend.',
          'stretch your arms.',
          'take three deep breaths.'
        ]
      };

      // Add behavior-based prompts for long sessions
      if (sessionDuration > 30 || promptCount > 10) { // 30 minutes or 10+ prompts
        fallbackPrompts.freehand.push(
          'go touch grass.',
          'step outside for a moment.',
          'look at something far away.',
          'take a walk around the room.'
        );
      }

      if (mode === 'freehand') {
        const prompts = fallbackPrompts.freehand;
        console.log('Freehand prompts available:', prompts);
        
        // Dynamic weights based on behavior
        let weights;
        if (sessionDuration > 30 || promptCount > 10) {
          // More variety for long sessions, including "go touch grass" prompts
          weights = new Array(prompts.length).fill(1);
          weights[0] = 3; // Still favor "let your mind drift" but less heavily
        } else {
          // Standard weights for normal sessions
          weights = [5, 1, 1, 1, 1];
          // Extend weights array if we have more prompts
          while (weights.length < prompts.length) {
            weights.push(1);
          }
        }
        
        console.log('Weights for freehand:', weights);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < prompts.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            console.log('Selected freehand prompt:', prompts[i]);
            return prompts[i];
          }
        }
        console.log('Fallback to first freehand prompt:', prompts[0]);
        return prompts[0]; // fallback
      }

      if (Array.isArray(fallbackPrompts[mode])) {
        const prompts = fallbackPrompts[mode];
        const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        return selectedPrompt;
      }

      const finalPrompt = fallbackPrompts[mode] || 'draw something creative.';
      return finalPrompt;
    }

    // Update prompt display
    async function updatePrompt(mode) {
      const promptText = await loadPrompt(mode);
      target.textContent = promptText;
      
      // Add visual indicator if using fallback prompts
      if (typeof window.supabaseClient === 'undefined') {
        target.style.color = '#ff6b6b'; // Red color to indicate fallback
        target.title = 'Using fallback prompts - Supabase not available';
      } else {
        target.style.color = ''; // Reset to default color
        target.title = '';
      }
      
      // Track user behavior
      updatePromptCount();

      // Handle complete drawing mode
      if (mode === 'complete_drawing') {
        initShapeGenerator();
        if (shapeGenerator) {
          // Generate new shape with fade-in animation
          shapeGenerator.generateShapeWithFade();
        }
      } else {
        // Clear any existing shapes for other modes
        const canvas = document.getElementById('canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    // Mode-specific toast messages
    const modeMessages = {
      'prompt': [
        "Create with intention...",
        "Let your creativity flow...",
        "Build something beautiful...",
        "Focus on the present moment...",
        "What wants to emerge?",
        "Trust your intuition..."
      ],
      'complete_drawing': [
        "Continue the story...",
        "Build upon what's begun...",
        "Collaborate with the canvas...",
        "Add your voice to the conversation...",
        "What comes next?",
        "Complete the vision..."
      ],
      'freehand': [
        "Let your mind drift...",
        "Breathe and let go...",
        "Each stroke is a moment...",
        "Find peace in the present...",
        "Just be...",
        "Flow without judgment..."
      ]
    };

    // Show random mode message
    function showModeMessage(mode) {
      const messages = modeMessages[mode];
      if (messages && messages.length > 0) {
        // Show toast 70% of the time to avoid overwhelming the user
        if (Math.random() < 0.7) {
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          // Show toast after a short delay to let the mode change settle
          setTimeout(() => {
            window.showToast(randomMessage);
          }, 500);
        }
      }
    }

    // Refresh-specific toast messages
    const refreshMessages = {
      'prompt': [
        "New inspiration awaits...",
        "Fresh ideas flowing...",
        "A new creative direction...",
        "What will emerge this time?",
        "Open to new possibilities...",
        "Another chance to create..."
      ],
      'complete_drawing': [
        "A new canvas to complete...",
        "Fresh shapes to build upon...",
        "Another story to continue...",
        "New beginnings await...",
        "What will you add to this?",
        "A blank slate to fill..."
      ],
      'freehand': [
        "A moment to breathe...",
        "New space for your thoughts...",
        "Fresh air for your mind...",
        "Another moment of presence...",
        "Clear your mind and begin...",
        "A new moment to be..."
      ]
    };

    // Show refresh message
    function showRefreshMessage(mode) {
      const messages = refreshMessages[mode];
      if (messages && messages.length > 0) {
        // Show toast 80% of the time for refresh (more likely since it's intentional)
        if (Math.random() < 0.8) {
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          // Show toast after a short delay
          setTimeout(() => {
            window.showToast(randomMessage);
          }, 400);
        }
      }
    }

    // Event listeners
    modeSelect.addEventListener('change', (e) => {
      // Track mode selection
      umami.track('mode_selected', { 
        mode: e.target.value 
      });
      
      updatePrompt(e.target.value);
      
      // Show mode-specific message
      showModeMessage(e.target.value);
    });

    newPromptBtn.addEventListener('click', () => {
      // Track prompt refresh
      umami.track('prompt_refreshed', { 
        mode: modeSelect.value 
      });
      
      updatePrompt(modeSelect.value);
      
      // Show refresh-specific toast message
      showRefreshMessage(modeSelect.value);
    });

    // Load initial prompt
    updatePrompt(modeSelect.value);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();