const portrait = document.querySelector('#portrait');
const photo = portrait.querySelector('img');
const headshot = photo.src;
const secondPhoto = portrait.href;
portrait.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const showSecond = photo.src === headshot;
  photo.src = showSecond ? secondPhoto : headshot;
  photo.alt = showSecond ? 'Zhilin He on a bridge' : 'Zhilin He wearing glasses';
  portrait.href = showSecond ? headshot : secondPhoto;
  portrait.setAttribute('aria-label', showSecond ? 'View the headshot of Zhilin He' : 'View the second portrait of Zhilin He');
});
