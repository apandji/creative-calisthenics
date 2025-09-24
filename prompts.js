(function () {
  const prompts = [
    'elephant with a flower hat.',
    'city skyline made of books.',
    'teacup sailing on an ocean of paint.',
    'bicycle that turns into a bird.',
    'tiny astronaut exploring a houseplant.'
  ];

  const target = document.querySelector('.prompt');
  if (!target) return;

  const LAST_KEY = 'cc:lastPromptIndex';
  const lastIdx = Number(localStorage.getItem(LAST_KEY));

  function pickIndex() {
    let idx = Math.floor(Math.random() * prompts.length);
    if (Number.isInteger(lastIdx) && prompts.length > 1 && idx === lastIdx) {
      idx = (idx + 1) % prompts.length;
    }
    return idx;
  }

  const idx = pickIndex();
  target.textContent = prompts[idx];
  localStorage.setItem(LAST_KEY, String(idx));
})();
