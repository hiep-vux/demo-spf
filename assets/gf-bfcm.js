(() => {
  const root = document.getElementById('gf-bfcm-promo');
  if (!root || window.GloboFilterBfcmPromo?.initialized) return;

  // BFCM 2026 — Smart Product Filter & Search. Mốc UTC, end = 00:00 UTC ngày sau ngày kết thúc.
  const phases = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      start: Date.UTC(2026, 9, 1, 0, 0, 0),   // Oct 1, 2026
      end: Date.UTC(2026, 10, 21, 0, 0, 0),   // hết Nov 20, 2026
      percent: '50%',
      trigger: 'First 3 months',
      title: 'Get 50% off your first 3 months',
      description: 'Choose any paid monthly plan and save 50% for the first 3 months.',
      annual: 'Prefer yearly billing? Get 25% off your first year.'
    },
    {
      id: 'bfcm',
      name: 'Black Friday',
      start: Date.UTC(2026, 10, 21, 0, 0, 0), // Nov 21, 2026
      end: Date.UTC(2026, 11, 1, 0, 0, 0),    // hết Nov 30, 2026
      percent: '25%',
      trigger: 'First 3 months',
      title: 'Get 25% off your first 3 months',
      description: 'Choose any paid monthly plan and save 25% for the first 3 months.',
      annual: 'Prefer yearly billing? Get 20% off your first year.'
    }
  ];

  const resolvePhase = (timestamp) => phases.find((phase) => timestamp >= phase.start && timestamp < phase.end) || null;
  window.GloboFilterBfcmPromo = Object.freeze({ initialized: true, resolvePhase });

  // Theme editor: ?gf_bfcm_preview=early-bird | bfcm để xem trước từng phase
  const previewPhase = window.Shopify?.designMode
    ? new URLSearchParams(window.location.search).get('gf_bfcm_preview')
    : null;
  const phase = phases.find((item) => item.id === previewPhase) || resolvePhase(Date.now());
  if (!phase) return;

  const set = (selector, text) => { root.querySelector(selector).textContent = text; };
  root.dataset.phase = phase.id;
  set('[data-gf-promo-badge]', phase.percent + ' OFF');
  set('[data-gf-promo-trigger-text]', phase.trigger);
  set('[data-gf-promo-duration]', phase.trigger);
  set('[data-gf-promo-phase]', phase.name);
  set('[data-gf-promo-percent]', phase.percent);
  set('[data-gf-promo-title]', phase.title);
  set('[data-gf-promo-description]', phase.description);
  set('[data-gf-promo-annual]', phase.annual);

  const locale = document.documentElement.lang || navigator.language || 'en';
  set('[data-gf-promo-end]', new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  }).format(new Date(phase.end - 60000)));

  const trigger = root.querySelector('.gf-promo__trigger');
  const overlay = root.querySelector('[data-gf-promo-overlay]');
  const dialog = root.querySelector('.gf-promo__dialog');
  const closeButton = root.querySelector('.gf-promo__close');
  let previouslyFocused = null;

  const openDialog = () => {
    previouslyFocused = document.activeElement;
    overlay.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    dialog.focus();
  };
  const closeDialog = () => {
    overlay.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    previouslyFocused?.focus();
  };

  trigger.addEventListener('click', openDialog);
  closeButton.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeDialog(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) closeDialog();
  });

  root.hidden = false;
})();