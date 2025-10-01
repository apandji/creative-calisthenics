(function() {
  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  let pullDistance = 0;
  const threshold = 80; // Distance needed to trigger refresh
  
  const refreshButton = document.querySelector('header button');
  if (!refreshButton) return;
  
  // Visual feedback element
  const pullIndicator = document.createElement('div');
  pullIndicator.style.cssText = `
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg, #f3f3f3);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 0.875rem;
    color: var(--text, #1a1a1a);
    z-index: 1000;
    transition: top 0.3s ease;
    pointer-events: none;
  `;
  pullIndicator.textContent = 'Pull to refresh';
  document.body.appendChild(pullIndicator);
  
  function updateIndicator() {
    const progress = Math.min(pullDistance / threshold, 1);
    pullIndicator.style.top = `${Math.min(pullDistance - 60, 20)}px`;
    pullIndicator.style.opacity = progress;
    
    if (pullDistance >= threshold) {
      pullIndicator.textContent = 'Release to refresh';
      pullIndicator.style.background = 'var(--accent, #000000)';
      pullIndicator.style.color = 'var(--bg, #f3f3f3)';
    } else {
      pullIndicator.textContent = 'Pull to refresh';
      pullIndicator.style.background = 'var(--bg, #f3f3f3)';
      pullIndicator.style.color = 'var(--text, #1a1a1a)';
    }
  }
  
  function resetIndicator() {
    pullIndicator.style.top = '-60px';
    pullIndicator.style.opacity = '0';
    pullIndicator.textContent = 'Pull to refresh';
    pullIndicator.style.background = 'var(--bg, #f3f3f3)';
    pullIndicator.style.color = 'var(--text, #1a1a1a)';
  }
  
  function triggerRefresh() {
    // Simulate button click
    refreshButton.click();
    resetIndicator();
  }
  
  // Touch events
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isPulling || window.scrollY > 0) return;
    
    currentY = e.touches[0].clientY;
    pullDistance = Math.max(0, currentY - startY);
    
    if (pullDistance > 0) {
      e.preventDefault();
      updateIndicator();
    }
  });
  
  document.addEventListener('touchend', () => {
    if (isPulling && pullDistance >= threshold) {
      triggerRefresh();
    } else {
      resetIndicator();
    }
    
    isPulling = false;
    pullDistance = 0;
  });
  
  // Mouse events for desktop testing
  let mouseStartY = 0;
  let isMousePulling = false;
  
  document.addEventListener('mousedown', (e) => {
    if (window.scrollY === 0 && e.target === document.body) {
      mouseStartY = e.clientY;
      isMousePulling = true;
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isMousePulling || window.scrollY > 0) return;
    
    const mouseCurrentY = e.clientY;
    pullDistance = Math.max(0, mouseCurrentY - mouseStartY);
    
    if (pullDistance > 0) {
      e.preventDefault();
      updateIndicator();
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isMousePulling && pullDistance >= threshold) {
      triggerRefresh();
    } else {
      resetIndicator();
    }
    
    isMousePulling = false;
    pullDistance = 0;
  });
})();
