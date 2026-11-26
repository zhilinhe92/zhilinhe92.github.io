import { createPublicationPreviews } from './preview.js';

const section = document.querySelector('#research');
const papers = [...section.querySelectorAll('#publication-list .paper')];
const toggle = section.querySelector('#media-motion-toggle');
const previews = createPublicationPreviews(path => new URL(path, document.baseURI).href, toggle);

function addPreview(article) {
  const fallback = article.querySelector('.paper-fallback');
  const data = { id: article.id, abbr: article.dataset.abbr };
  for (const link of fallback.querySelectorAll('a[data-visual]')) {
    const item = link.dataset;
    data[item.visual] = {
      src: link.href, alt: item.alt, caption: item.caption,
      width: Number(item.width), height: Number(item.height),
      gif: item.gif, poster: item.poster,
    };
  }
  const preview = previews.create(data);
  if (preview) fallback.replaceWith(preview);
}

function addPanelControl(details, links) {
  const summary = details.querySelector('summary');
  const control = document.createElement('button');
  control.type = 'button';
  control.textContent = summary.textContent;
  control.setAttribute('aria-controls', details.id);
  const update = () => control.setAttribute('aria-expanded', String(details.open));
  details.addEventListener('toggle', update);
  control.addEventListener('click', () => { details.open = !details.open; });
  update();
  links.append(control);
  // The native summary is the disclosure control when JavaScript is disabled.
  summary.hidden = true;
}

function enableCitationCopy(details, code) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-citation';
  button.textContent = 'Copy BibTeX';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = 'Copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Citation selected. Copy it using your keyboard.';
    }
  });
  details.append(button, status);
}

for (const article of papers) {
  addPreview(article);
  const links = article.querySelector('.paper-links');
  for (const details of article.querySelectorAll('.paper-detail')) {
    addPanelControl(details, links);
    const citation = details.querySelector('code');
    if (citation) enableCitationCopy(details, citation);
  }
}
toggle.hidden = false;

const filter = section.querySelector('.paper-filter');
const search = filter.querySelector('#publication-search');
const year = filter.querySelector('#year-filter');
const selected = filter.querySelector('#selected-filter');
const count = filter.querySelector('#result-count');
const empty = section.querySelector('#publication-empty');
for (const value of new Set(papers.map(article => article.dataset.year))) {
  year.add(new Option(value, value));
}
const normalized = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const text = papers.map(article => normalized([article.dataset.abbr, article.dataset.topics, article.querySelector('.paper-info').textContent].join(' ')));
function filterPapers() {
  const terms = normalized(search.value).trim().split(/\s+/).filter(Boolean);
  let matches = 0;
  papers.forEach((article, index) => {
    const visible = (!year.value || year.value === article.dataset.year)
      && (!selected.checked || article.dataset.selected === 'true')
      && terms.every(term => text[index].includes(term));
    article.hidden = !visible;
    if (visible) matches++;
  });
  count.textContent = `${matches} of ${papers.length} papers`;
  empty.hidden = matches !== 0;
}
const params = new URLSearchParams(location.search);
const hash = location.hash.slice(1);
const alias = papers.find(article => article.dataset.abbr === hash || article.id.slice('publication-'.length) === hash);
search.value = params.get('q') ?? (hash.startsWith('q=') ? new URLSearchParams(hash).get('q') : alias?.dataset.abbr) ?? '';
filter.open = Boolean(search.value);
search.addEventListener('input', filterPapers);
year.addEventListener('change', filterPapers);
selected.addEventListener('change', filterPapers);
filterPapers();
filter.hidden = false;
