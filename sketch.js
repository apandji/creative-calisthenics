(function () {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Elements
  const colorInput = document.getElementById('color');
  const sizeInput = document.getElementById('size');
  const clearBtn = document.getElementById('clear');
  const saveBtn = document.getElementById('save');

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

  // Resize with devicePixelRatio for crisp lines, avoid Safari RO loops
  function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.floor(rect.width || canvas.parentElement.clientWidth || 640);
    const cssHeight = Math.floor(rect.height || parseFloat(getComputedStyle(canvas).height) || 420);

    if (cssWidth === lastCssWidth && cssHeight === lastCssHeight && dpr === lastDpr) {
      return; // nothing to do
    }

    lastCssWidth = cssWidth;
    lastCssHeight = cssHeight;
    lastDpr = dpr;

    const pixelWidth = Math.max(1, Math.floor(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.floor(cssHeight * dpr));

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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

  // Pointer events
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getPos(e);
    const pressure = typeof e.pressure === 'number' && e.pressure > 0 ? e.pressure : 0.5;
    startDraw(x, y, pressure, e.timeStamp || performance.now());
    // draw a dot immediately on press
    drawTo(x + 0.01, y + 0.01, pressure, e.timeStamp || performance.now());
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const pressure = typeof e.pressure === 'number' && e.pressure > 0 ? e.pressure : 0.5;
    drawTo(x, y, pressure, e.timeStamp || performance.now());
  });

  canvas.addEventListener('pointerup', endDraw);
  canvas.addEventListener('pointercancel', endDraw);
  canvas.addEventListener('pointerleave', endDraw);

  // End drawing if pointer released anywhere
  window.addEventListener('pointerup', endDraw);

  // Mouse fallbacks (older browsers or if pointer events disabled)
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getPos(e);
    startDraw(x, y, 0.5, e.timeStamp || performance.now());
    drawTo(x + 0.01, y + 0.01, 0.5, e.timeStamp || performance.now());
  });
  window.addEventListener('mousemove', (e) => {
    const { x, y } = getPos(e);
    drawTo(x, y, 0.5, e.timeStamp || performance.now());
  });
  window.addEventListener('mouseup', endDraw);

  // Prevent context menu interfering
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  // Controls
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      strokeColor = e.target.value;
    });
  }
  if (sizeInput) {
    sizeInput.addEventListener('input', (e) => {
      strokeWidth = Number(e.target.value);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'sketch.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // Resize handling (debounced to avoid RO loops in Safari)
  let roPending = false;
  const ro = new ResizeObserver(() => {
    if (roPending) return;
    roPending = true;
    requestAnimationFrame(() => {
      roPending = false;
      resizeCanvas();
    });
  });
  const observeTarget = canvas.parentElement || document.body;
  ro.observe(observeTarget);
  window.addEventListener('orientationchange', () => requestAnimationFrame(resizeCanvas));
  window.addEventListener('resize', () => requestAnimationFrame(resizeCanvas));
  // React to DPR changes (Safari on zoom/fullscreen)
  if (window.matchMedia) {
    try {
      window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener('change', resizeCanvas);
    } catch (_) { /* no-op */ }
  }

  // Init
  resizeCanvas();

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
