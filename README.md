# ۴۰۴ — طبیعت پیدا نشد

An interactive environmental documentary / digital archive about places in Iran that have
changed, dried up, or come under pressure. Fully Persian (RTL) interface.

**Live site:** https://parsa-web.github.io/404-Nature/

## Stack

React 19 · TypeScript · Vite · React Router · plain CSS (no UI framework, no Tailwind)

## Routes

`/` · `/lost-places` · `/lost-places/:slug` (urmia-lake, anazali-wetland, zayandeh-rud,
hyrcanian-forests, hammoun-wetland) · `/wildlife` · `/data` · `/sources` · `/about`
· `/search` · `/404`

## Development

```bash
npm install
npm run dev
npm run build
```

The production `base` is `/404-Nature/` (GitHub Pages). Override it with the `VITE_BASE`
environment variable when hosting elsewhere, e.g. `VITE_BASE=/ npm run build`.

## Content policy

No invented statistics. Every number, date and quantitative claim links to its source
(UNEP, UNESCO, Ramsar Convention, NASA, USGS, IUCN and peer-reviewed papers); the full
list lives in `src/data/sources.ts` and on the `/sources` page. Where a same-angle
before/after image pair was not available under a free licence, the limitation is stated
explicitly under the comparison instead of faking it.

All photography comes from Wikimedia Commons under free licences, registered centrally in
`src/utils/images.ts`, with credit shown on every image.

## Structure

```
src/
  components/   reusable UI (GlitchText, BeforeAfterSlider, Frame, …)
  hero/         the "404 // UNSTABLE ARCHIVE" hero motion system
  pages/        one file per route
  layouts/      RootLayout (nav, mobile menu, search overlay, footer)
  data/         content layer: locations, wildlife, data points, sources
  hooks/        useReveal, useSeo, useBodyLock, useSearchIndex
  utils/        image URL helper, Persian text normalisation
  styles/       global design tokens + per-area stylesheets
```

