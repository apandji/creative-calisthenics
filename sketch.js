(function () {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Elements
  const colorInput = document.getElementById('color');
  const sizeInput = document.getElementById('size');
  const clearBtn = document.getElementById('clear');
  const saveBtn = document.getElementById('save');
  const cursor = document.getElementById('cursor');

  // Initialize watercolor brush and fade timer
  const watercolorBrush = new WatercolorBrush(canvas, ctx);
  const fadeTimer = new FadeTimer(canvas, ctx);
  
  // Connect fade timer to watercolor brush
  watercolorBrush.setFadeTimer(fadeTimer);

  // State
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let strokeColor = colorInput ? colorInput.value : '#000000';
  let strokeWidth = sizeInput ? Number(sizeInput.value) : 15; // Default to 37.5% (15/40) for better mobile finger drawing
  let lastCssWidth = 0;
  let lastCssHeight = 0;
  let lastDpr = 1;
  let lastTime = 0;
  let lastSpeed = 0;
  let currentWidth = strokeWidth;

  // Resize handling that preserves drawing content without any scaling
  function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.floor(rect.width);
    const cssHeight = Math.floor(rect.height);

    if (cssWidth === lastCssWidth && cssHeight === lastCssHeight && dpr === lastDpr) {
      return;
    }

    console.log('Resizing canvas:', {
      from: { width: lastCssWidth, height: lastCssHeight },
      to: { width: cssWidth, height: cssHeight },
      dpr: dpr
    });

    // Save current canvas content as a data URL before resizing
    let savedDataURL = null;
    const hasContent = canvas.width > 0 && canvas.height > 0;
    if (hasContent) {
      try {
        savedDataURL = canvas.toDataURL('image/png');
        console.log('Saved canvas content as data URL');
      } catch (error) {
        console.warn('Failed to save canvas content:', error);
      }
    }

    lastCssWidth = cssWidth;
    lastCssHeight = cssHeight;
    lastDpr = dpr;

    // Set canvas internal size (for drawing)
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    
    // Set CSS size (for display)
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';

    // Scale context for crisp lines
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore canvas content if it existed
    if (savedDataURL) {
      const img = new Image();
      img.onload = function() {
        try {
          // Save the current transformation matrix
          ctx.save();
          
          // Reset the transformation matrix to avoid scaling
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          
          // Draw the image at its original size without any scaling
          ctx.drawImage(img, 0, 0);
          
          // Restore the transformation matrix
          ctx.restore();
          
          console.log('Canvas content restored without scaling');
        } catch (error) {
          console.warn('Failed to restore canvas content:', error);
        }
      };
      img.src = savedDataURL;
    }
  }

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX ?? (evt.touches && evt.touches[0].clientX)) - rect.left;
    const y = (evt.clientY ?? (evt.touches && evt.touches[0].clientY)) - rect.top;
    return { x, y };
  }

  function startDraw(x, y, pressure = 0.5, t = performance.now()) {
    isDrawing = true;
    lastX = x;
    lastY = y;
    lastTime = t;
    lastSpeed = 0;
    currentWidth = computeWidth(pressure, 0);
    
    // Start watercolor brush stroke
    watercolorBrush.startStroke(x, y, pressure);
  }

  function drawTo(x, y, pressure = 0.5, t = performance.now()) {
    if (!isDrawing) return;
    const dt = Math.max(1, t - lastTime);
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    const speed = dist / dt; // px per ms
    // Low-pass filter speed for stability
    const smoothedSpeed = lastSpeed * 0.7 + speed * 0.3;
    lastSpeed = smoothedSpeed;

    const targetWidth = computeWidth(pressure, smoothedSpeed);
    // Smooth the width for an ink-like feel
    currentWidth = currentWidth * 0.6 + targetWidth * 0.4;

    // Continue watercolor brush stroke
    watercolorBrush.continueStroke(x, y, pressure);
    
    lastX = x;
    lastY = y;
    lastTime = t;
  }

  function endDraw() {
    isDrawing = false;
    
    // End watercolor brush stroke
    watercolorBrush.endStroke();
    
    // Start fade timer if not already active
    if (!fadeTimer.isTimerActive()) {
      fadeTimer.start();
    }
  }

  // Safari-compatible event handling
  function handleStart(e) {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getPos(e);
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5;
    startDraw(x, y, pressure, e.timeStamp || performance.now());
    drawTo(x + 0.01, y + 0.01, pressure, e.timeStamp || performance.now());
  }

  function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getPos(e);
    const pressure = (e.pressure && e.pressure > 0) ? e.pressure : 0.5;
    drawTo(x, y, pressure, e.timeStamp || performance.now());
  }

  function handleEnd(e) {
    e.preventDefault();
    endDraw();
  }

  // Primary events (pointer for modern browsers)
  canvas.addEventListener('pointerdown', handleStart);
  canvas.addEventListener('pointermove', handleMove);
  canvas.addEventListener('pointerup', handleEnd);
  canvas.addEventListener('pointercancel', handleEnd);
  canvas.addEventListener('pointerleave', handleEnd);

  // Mouse fallback (for Safari and older browsers)
  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', handleEnd);

  // Touch fallback
  canvas.addEventListener('touchstart', handleStart);
  canvas.addEventListener('touchmove', handleMove);
  canvas.addEventListener('touchend', handleEnd);

  // Prevent context menu and scrolling
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('selectstart', (e) => e.preventDefault());

  // Update cursor size based on brush size
  function updateCursorSize() {
    if (cursor) {
      const size = Math.max(8, strokeWidth * 2); // Minimum 8px, scale up from brush size
      cursor.style.width = size + 'px';
      cursor.style.height = size + 'px';
    }
  }

  // Mouse tracking for cursor
  function updateCursorPosition(e) {
    if (!cursor) return;
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = canvas.parentElement.getBoundingClientRect();
    
    // Calculate position relative to the canvas container
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }

  // Controls
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      strokeColor = e.target.value;
      // Update watercolor brush color (convert to zen palette index)
      const zenColors = watercolorBrush.getZenColors();
      const colorIndex = zenColors.indexOf(e.target.value);
      if (colorIndex !== -1) {
        watercolorBrush.setColor(colorIndex);
      }
    });
  }
  if (sizeInput) {
    sizeInput.addEventListener('input', (e) => {
      strokeWidth = Number(e.target.value);
      watercolorBrush.setSize(strokeWidth);
      updateCursorSize();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // Show zen-like toast notification
      if (typeof window.showToast === 'function') {
        window.showToast('Drawing cleared');
      }
      // Clear watercolor brush
      watercolorBrush.clear();
      // Stop fade timer
      fadeTimer.stop();
      // Slow dissolve animation
      if (typeof window.dissolveCanvas === 'function') {
        window.dissolveCanvas();
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 2000);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }
  // Improved resize handling with debouncing
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 150); // Increased delay for better stability
  }
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // Use ResizeObserver if available, fallback to window events
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas.parentElement);
  }

  // Mouse tracking events
  canvas.addEventListener('mousemove', updateCursorPosition);
  canvas.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.display = 'block';
  });
  canvas.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.display = 'none';
  });

  // Initialize zen color palette
  function initZenColorPalette() {
    const zenColorsContainer = document.getElementById('zen-colors');
    if (!zenColorsContainer) return;
    
    const zenColors = watercolorBrush.getZenColors();
    
    zenColors.forEach((color, index) => {
      const colorElement = document.createElement('div');
      colorElement.className = 'zen-color';
      colorElement.style.backgroundColor = color;
      colorElement.setAttribute('data-color', color);
      colorElement.setAttribute('data-index', index);
      
      // Add click handler
      colorElement.addEventListener('click', () => {
        // Remove active class from all colors
        document.querySelectorAll('.zen-color').forEach(el => el.classList.remove('active'));
        // Add active class to clicked color
        colorElement.classList.add('active');
        
        // Update watercolor brush color
        watercolorBrush.setColor(index);
        
        // Update stroke color for compatibility
        strokeColor = color;
      });
      
      zenColorsContainer.appendChild(colorElement);
    });
    
    // Set first color as active
    if (zenColorsContainer.firstChild) {
      zenColorsContainer.firstChild.classList.add('active');
    }
  }

  // Init
  resizeCanvas();
  updateCursorSize(); // Set initial cursor size
  initZenColorPalette(); // Initialize zen color palette

  // Helpers
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function computeWidth(pressure, speed) {
    const maxW = strokeWidth;
    const minW = Math.max(0.6, maxW * 0.18);
    // Speed reduces width (faster -> thinner). Map speed ~[0..1] to [1..0.3]
    const speedFactor = clamp(1 / (1 + 2.5 * speed), 0.3, 1);
    // Pressure increases width (if available)
    const pressureFactor = clamp(0.6 + 0.8 * pressure, 0.6, 1.4);
    const w = clamp(maxW * speedFactor * pressureFactor, minW, maxW);
    return w;
  }
})();
