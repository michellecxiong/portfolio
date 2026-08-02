(function () {
  const root = document.documentElement;
  const body = document.body;

  const skimBtn = document.getElementById('skimToggle');
  const soundBtn = document.getElementById('soundToggle');
  const darkBtn = document.getElementById('darkToggle');
  const writingPill = document.getElementById('writingPill');
  const resumeLink = document.getElementById('resumeLink');
  const toastEl = document.getElementById('toast');

  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ---- Dark mode ----
  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      darkBtn.setAttribute('aria-pressed', 'true');
      darkBtn.querySelector('.pill-emoji').textContent = '☀️';
    } else {
      root.setAttribute('data-theme', 'light');
      darkBtn.setAttribute('aria-pressed', 'false');
      darkBtn.querySelector('.pill-emoji').textContent = '🌙';
    }
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  darkBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // ---- Skim mode ----
  let skimming = false;
  skimBtn.addEventListener('click', () => {
    skimming = !skimming;
    body.classList.toggle('skim', skimming);
    skimBtn.setAttribute('aria-pressed', String(skimming));
    showToast(skimming ? 'Skim mode on — showing the short version.' : 'Skim mode off.');
  });

  // ---- Sound toggle (subtle UI blips via Web Audio, no external asset) ----
  let soundOn = false;
  let audioCtx;
  function playBlip(freq) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {
      /* audio unsupported, fail silently */
    }
  }

  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.querySelector('.pill-emoji').textContent = soundOn ? '🔊' : '🔈';
    if (soundOn) playBlip(660);
    showToast(soundOn ? 'Sound on.' : 'Sound off.');
  });

  document.querySelectorAll('.pill, .resume-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => playBlip(440));
  });

  // ---- Writing pill ----
  writingPill.addEventListener('click', (e) => {
    const writingSection = document.getElementById('writing');
    if (writingSection) {
      const hasRealLinks = writingSection.querySelectorAll('.placeholder-row').length === 0;
      if (!hasRealLinks) {
        e.preventDefault();
        showToast('Writing page coming soon.');
      }
    }
  });

  // ---- Resume link ----
  resumeLink.addEventListener('click', (e) => {
    if (resumeLink.getAttribute('href') === '#') {
      e.preventDefault();
      showToast('Add your resume PDF and link it here.');
    }
  });
})();
