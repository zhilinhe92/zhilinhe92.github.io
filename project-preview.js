// Enhance the linked posters without changing their no-JavaScript fallback.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-project-video]').forEach((container) => {
  const link = container.querySelector('a');
  const poster = link?.querySelector('img');
  if (!link || !poster) return;

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

  let visible = !('IntersectionObserver' in window);
  let failed = false;

  const mayPlay = () => visible && !document.hidden && !reducedMotion.matches && !failed;

  function sync() {
    const active = mayPlay();
    video.autoplay = active;
    if (active) {
      if (!video.hasAttribute('src')) video.src = container.dataset.projectVideo;
      // Keep the linked poster if the browser restricts automatic playback.
      video.play().catch(() => {});
    } else video.pause();
  }

  video.addEventListener('playing', () => {
    if (!mayPlay()) { video.pause(); return; }
    frame.dataset.ready = 'true';
  });
  video.addEventListener('error', () => {
    failed = true;
    frame.dataset.ready = 'false';
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', sync);
  reducedMotion.addEventListener('change', sync);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
      sync();
    }, { threshold: [0, 0.15] });
    observer.observe(frame);
  }
  sync();
});
