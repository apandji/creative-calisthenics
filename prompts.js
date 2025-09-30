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
          console.log('Creating ShapeGenerator with canvas:', canvas, 'ctx:', ctx);
          shapeGenerator = new ShapeGenerator(canvas, ctx);
          console.log('ShapeGenerator created:', shapeGenerator);
        } else {
          console.error('Canvas not found for ShapeGenerator');
        }
      }
    }

    // Load prompt from Supabase
    async function loadPrompt(mode = 'prompt') {
      console.log('Loading prompt for mode:', mode);
      console.log('Supabase client available:', typeof window.supabaseClient !== 'undefined');
      console.log('Supabase client:', window.supabaseClient);
      
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
          console.log('No active prompts found, trying without active filter...');
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

        console.log('Supabase response data:', data);
        console.log('Data length:', data ? data.length : 'null');

        if (data && Array.isArray(data) && data.length > 0) {
          // Use weighted selection for freehand mode, simple random for others
          let selectedPrompt;
          if (mode === 'freehand') {
            selectedPrompt = selectWeightedPrompt(data);
          } else {
            const randomIndex = Math.floor(Math.random() * data.length);
            selectedPrompt = data[randomIndex].content;
          }
          console.log('Loaded prompt from Supabase:', selectedPrompt);
          return selectedPrompt;
        } else {
          console.log('No prompts found in Supabase, using fallback');
          const fallback = getFallbackPrompt(mode);
          console.log('Using fallback prompt:', fallback);
          return fallback;
        }
      } catch (err) {
        console.error('Error:', err);
        const fallback = getFallbackPrompt(mode);
        console.log('Using fallback prompt after error:', fallback);
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
        console.log(`Selected ${mode} prompt:`, selectedPrompt);
        return selectedPrompt;
      }

      const finalPrompt = fallbackPrompts[mode] || 'draw something creative.';
      console.log(`Final ${mode} prompt:`, finalPrompt);
      return finalPrompt;
    }

    // Update prompt display
    async function updatePrompt(mode) {
      console.log('updatePrompt called with mode:', mode);
      const promptText = await loadPrompt(mode);
      console.log('Setting prompt text to:', promptText);
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
        console.log('Complete drawing mode - generating shape');
        initShapeGenerator();
        console.log('ShapeGenerator after init:', shapeGenerator);
        if (shapeGenerator) {
          console.log('Calling generateShapeWithFade');
          // Generate new shape with fade-in animation
          shapeGenerator.generateShapeWithFade();
        } else {
          console.error('ShapeGenerator not available');
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

    // Event listeners
    modeSelect.addEventListener('change', (e) => {
      // Track mode selection
      umami.track('mode_selected', { 
        mode: e.target.value 
      });
      
      console.log('Mode select changed to:', e.target.value);
      updatePrompt(e.target.value);
    });

    newPromptBtn.addEventListener('click', () => {
      // Track prompt refresh
      umami.track('prompt_refreshed', { 
        mode: modeSelect.value 
      });
      
      console.log('New prompt button clicked, current mode:', modeSelect.value);
      updatePrompt(modeSelect.value);
    });

    // Load initial prompt
    console.log('Loading initial prompt for mode:', modeSelect.value);
    updatePrompt(modeSelect.value);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();