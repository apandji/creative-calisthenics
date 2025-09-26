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

  // State
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let strokeColor = colorInput ? colorInput.value : '#000000';
  let strokeWidth = sizeInput ? Number(sizeInput.value) : 4; // acts as max width
  let lastCssWidth = 0;
  let lastCssHeight = 0;
  let lastDpr = 1;
  let lastTime = 0;
  let lastSpeed = 0;
  let currentWidth = strokeWidth;

  // Simplified resize for Safari compatibility with content preservation
  function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.floor(rect.width);
    const cssHeight = Math.floor(rect.height);

    if (cssWidth === lastCssWidth && cssHeight === lastCssHeight && dpr === lastDpr) {
      return;
    }

    // Save current canvas content before resizing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some(pixel => pixel !== 0);

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
    if (hasContent) {
      try {
        // Simply put the image data back - this preserves the exact original content
        // without any scaling or stretching
        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        // Fallback: if this fails, log the error
        console.warn('Canvas content restoration failed:', error);
      }
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

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = currentWidth;
    // Slight opacity variation with pressure for ink wash effect
    const alpha = 0.7 + 0.3 * clamp(pressure, 0, 1);
    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = prevAlpha;
    lastX = x;
    lastY = y;
    lastTime = t;
  }

  function endDraw() {
    isDrawing = false;
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
    });
  }
  if (sizeInput) {
    sizeInput.addEventListener('input', (e) => {
      strokeWidth = Number(e.target.value);
      updateCursorSize();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      // Show zen-like toast notification
      if (typeof window.showToast === 'function') {
        window.showToast('Drawing cleared');
      }
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
  // Simple resize handling for Safari
  function handleResize() {
    setTimeout(resizeCanvas, 100); // Small delay for Safari
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

  // Init
  resizeCanvas();
  updateCursorSize(); // Set initial cursor size

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
