// Enhance the linked posters without changing their no-JavaScript fallback.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-project-video]').forEach((container) => {
  const link = container.querySelector('a');
  const poster = link?.querySelector('img');
  if (!link || !poster) return;

  const name = container.dataset.projectName || 'Project';
  const frame = document.createElement('div');
  frame.className = 'project-preview';
  link.before(frame);
  frame.append(link);
  link.classList.add('project-preview-link');

  const video = document.createElement('video');
  video.className = 'project-preview-video';
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'none';
  video.poster = poster.src;
  video.width = 320;
  video.height = 180;
  // The enclosing link and original image already describe this silent preview.
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  link.append(video);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'project-preview-toggle';
  frame.append(toggle);

  let visible = !('IntersectionObserver' in window);
  let manualChoice = null;
  let autoplayBlocked = false;
  let failed = false;

  const wantsPlayback = () => manualChoice ?? !reducedMotion.matches;
  const mayPlay = () => visible && !document.hidden && wantsPlayback() && !autoplayBlocked && !failed;

  function updateControl() {
    const action = video.paused ? 'Play' : 'Pause';
    toggle.textContent = video.paused ? '▷' : 'Ⅱ';
    toggle.setAttribute('aria-label', `${action} ${name} preview`);
    toggle.title = `${action} preview`;
  }

  function sync() {
    const active = mayPlay();
    video.autoplay = active;
    if (active) {
      if (!video.hasAttribute('src')) video.src = container.dataset.projectVideo;
      video.play().catch((error) => {
        // Autoplay restrictions (e.g. mobile Low Power Mode) leave a working
        // Play button. A deliberate pause can also reject an in-flight play.
        if (error.name === 'NotAllowedError') autoplayBlocked = true;
        updateControl();
      });
    } else video.pause();
    updateControl();
  }

  toggle.addEventListener('click', () => {
    manualChoice = video.paused;
    autoplayBlocked = false;
    sync();
  });
  video.addEventListener('playing', () => {
    if (!mayPlay()) { video.pause(); return; }
    frame.dataset.ready = 'true';
    updateControl();
  });
  video.addEventListener('pause', updateControl);
  video.addEventListener('error', () => {
    failed = true;
    frame.dataset.ready = 'false';
    toggle.hidden = true;
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', sync);
  reducedMotion.addEventListener('change', () => {
    manualChoice = null;
    autoplayBlocked = false;
    sync();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      sync();
    }, { threshold: [0, 0.15] });
    observer.observe(frame);
  }
  sync();
});
