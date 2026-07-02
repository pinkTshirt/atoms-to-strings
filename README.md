# From atom to string

A single-page, dependency-free interactive that zooms through the structure of matter: atom &rarr; nucleus &rarr; proton &rarr; quark &rarr; string (hypothetical). Each layer has a short theory write-up and an approximate length scale.

## View it

Open `index.html` in any browser &mdash; no build step, no dependencies, no server required.

To host it for free with GitHub Pages: **Settings &rarr; Pages &rarr; Source: `main` branch, `/ (root)`**, then it'll be live at `https://<your-username>.github.io/<repo-name>/`.

## Controls

- **Scroll** over the card to zoom in (down) or out (up). It releases the page scroll at both ends.
- **Arrow keys** (&uarr;/&darr; or &larr;/&rarr;) when the card is focused.
- **Zoom in / Zoom out** buttons auto-advance through the stages.
- The **dots** jump straight to any stage.

## Stack

Plain HTML, CSS, and vanilla JS. No build tools, no external requests, no tracking. Dark mode follows the OS setting (`prefers-color-scheme`), and `prefers-reduced-motion` is respected.
