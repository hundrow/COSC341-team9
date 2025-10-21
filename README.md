# Redolent Fragrances — Starter Template

This is a lightweight, accessible starter you can reuse as the base for every page.

- index.html — Semantic layout (header, hero, products, newsletter, footer)
- styles.css — Brand colors (monochrome), typography, responsive grid
- main.js — Small interactions (mobile nav, add-to-cart demo, newsletter demo)

## Quick start (Windows PowerShell)

Open `index.html` directly in your browser, or start a simple local server for clean routing and CORS:

```powershell
# Option A: Use Python (if installed)
python -m http.server 5500
# then visit http://localhost:5500

# Option B: Use Node (if installed)
# Install serve globally once:
npm i -g serve
serve -l 5500 .
```

## Customize
- Replace placeholder hero background in `styles.css` (search for `hero__media`)
- Replace logo paths in `index.html` when your `/assets/logo` is ready
- Duplicate `index.html` for other pages and adjust section IDs/links

## Notes
- Fonts are loaded from Google Fonts: Playfair Display (headings), Lato (body)
- Color variables and spacing are defined in `:root` for easy theming
- Keep images under `/assets/images/...` to match the content inventory in `LAB06.md`

## New asset: Perfume on autumn river (SVG)

Illustration added at `assets/images/perfume-autumn-river.svg`.

Embed it inline or as an `<img>`:

```html
<img src="assets/images/perfume-autumn-river.svg" alt="Perfume bottle on autumn leaves beside a river" width="800" height="450">
```

Accessibility tip: The SVG includes a `<title>` and `<desc>` for screen readers. If you use `<img>`, provide a concise `alt` (as above). For decorative use, set `alt=""` or `aria-hidden="true"` as appropriate.
