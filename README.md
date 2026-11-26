# Zhilin He

A static academic homepage adapted from [Jon Barron’s website](https://github.com/jonbarron/jonbarron.github.io).

Edit the biography, Updates, papers, service, and projects in `index.html`. For a new publication, copy an existing paper entry, assign unique article and panel IDs, and update its links, figure dimensions, and citation. Add the citation to `assets/publications.bib` for the bibliography download. Place new figures and experiment montages in `assets/publications/`.

Run `python3 -m http.server 8000` in this folder to preview the site at <http://localhost:8000/>. GitHub Pages can publish these files directly from the root of the main branch in `zhilinhe92/zhilinhe92.github.io`.

Search engines can crawl the site through `robots.txt` and `sitemap.xml`. The canonical URL is `https://zhilinhe92.github.io/`. To check Google indexing or request a crawl, verify this URL-prefix property in Google Search Console, inspect the homepage URL, and submit `sitemap.xml`. Indexing is controlled by Google and is not immediate or guaranteed.

Project thumbnails automatically play silent, looping video previews while visible, without playback controls. To change a clip, replace its `data-project-video` path in `index.html`; keep the linked image as a fallback. `project-preview.js` respects reduced-motion preferences and pauses videos outside the viewport. Sources and excerpts are documented in `assets/projects/PREVIEW-SOURCES.md`.

The Lato font license is in `assets/fonts/OFL.txt`. Research media credits are in `assets/publications/CREDITS.md`. The GenerativeDynamics project image comes from its [hardware demonstrations](https://hhhhzl.github.io/generative-dynamics/results/). The Tennis Buddy image and video are from the [original project](https://z4ziad.github.io/2026-01-07-tennis_buddy/).

The footer uses a dedicated [Flag Counter map](https://info.flagcounter.com/Pvr8), installed in November 2026. Counts start at installation; historical traffic is not included. The external image counts loads and displays visitor countries and pageviews. Keep this image eager-loaded so visits also count when a reader does not scroll to the footer. See the [provider FAQ](https://www.flagcounter.com/faq.html) for counting and update frequency. To remove visitor tracking, remove the `visitor-map` figure from `index.html`.
