# CLAUDE.md

This file guides Claude Code (and other AI assistants) working in this repository.

## What this is

The public website for **The Ryder McCoy Band** (Southern Gothic outlaw country / swamp blues / Southern trap), out of Slapout, Alabama, on **Biloxi Blues Records**. Live at `https://rydermccoy.com`, deployed on **Netlify**, auto-deploying from the `main` branch.

**Static HTML/CSS/JS. No framework, no bundler, no build step, no `package.json`.** Every page is a single self-contained `.html` file with inline `<style>` and a handful of shared `<script src="/js/...">` includes. Keep it that way — do not introduce a framework or bundler without discussing it with the user first.

## Band facts (verified — don't re-derive or invent)

- **Lineup:** Ryder McCoy (vocals, guitar, songwriter), Jessie James Jenkins (vocals), Unc (vocals, spoken word)
- **Location:** Slapout, Alabama · Label: Biloxi Blues Records
- **Genre tags:** Outlaw Country, Swamp Blues, Southern Trap, Americana
- **Booking contact:** `booking@biloxibluesrecords.com`, plus a Netlify form (`name="contact"`) on the homepage `#booking` section
- **Footer credit:** every page links `https://lsgsalesjobs.com/` ("Developed by LSG Artist Homes") — do not remove
- **Core brand promise, repeated everywhere:** every track is free to stream and free to download, no email required. "No email. No catch." Never add a download/listen gate.

### Catalog (5 records, all free, all downloadable)

| Record | Page | Tracks | Status |
|---|---|---|---|
| The Warning | `/warning` | 14 | **Live** on Spotify + Apple Music (verified album URLs wired in on the homepage release panel) |
| The Glass Rose Sessions | `/glass-rose` | **15** (not 14 — this number gets miscopied often, double-check it) | — |
| The Fall | `/fall` | 13 | — |
| Welcome to the Woods | `/woods` | 13 | — |
| Welcome to the Other Place | `/other-place` | 13 | — |

**Slapout Secrets** — the mailing list, via Buttondown. Username `slapoutsecrets` (verified live: a real test subscription was submitted and the confirmation email was confirmed to arrive). Endpoint: `https://buttondown.com/api/emails/embed-subscribe/slapoutsecrets`. Signup form lives on the homepage at `#slapout-secrets`, always optional, never gates anything.

## Site map

**In the main nav** (`js/site-nav.js`'s `links` array — keep this short, don't add every page here):
Home, The Warning, The Glass Rose, The Fall, Welcome to the Woods, Welcome to the Other Place, The Wall, The Dirt Road.

**Not in nav, but real and linked from elsewhere:**
- `/press` — press kit, linked from the homepage `#booking` section and every page's footer, deliberately excluded from the main nav ("don't overcrowd nav" was an explicit instruction when it was built)

**Present on disk but not linked from nav or footer** (orphaned/retired — check with the user before assuming these need work, and before assuming they're safe to delete):
- `dispatches.html` — retired; `_redirects` sends `/dispatches` → `/dirt-road`
- `slapout-after-midnight.html` — a browser game, deliberately hidden from nav (see commit "Hide After Midnight from site navigation")
- `slapout-run.html` — another interactive page ("RYDER: WELCOME TO SLAPOUT"), in `sitemap.xml` but not in the nav `links` array

## Page templates and their JS

Four different "kinds" of page, each with its own dedicated player script — **don't mix these up**:

- **Homepage** (`index.html`) → `js/home-player.js` (the 5-song "Start On The Dirt Road" sampler)
- **Case-file album pages** (`warning.html`, `fall.html`, `woods.html`, `other-place.html`) → `js/casefile-player.js`. Shared visual template: track cards with an expandable "Field Notes" drawer, a sticky bottom deck player.
- **Glass Rose** (`glass-rose.html`) → `js/glass-player.js`. Its own separate glitch/venue-effect template — don't casefile-ify it.
- **Non-album pages with a persistent mini-player** (`dirt-road.html`, `wall.html`, `press.html`) → `js/resume-player.js`, which lets playback continue/resume across page navigation.

Shared across all of the above: `js/player-state.js` (the actual `<audio>` engine, exposed as `window.RyderPlayback`; every other player script calls `.create()` on it) and `js/site-nav.js` (builds the top nav bar into `<nav id="slapNav">`, highlights the current page).

## Data files

- `data/home.js` → `window.RYDER_FOUNDATIONS`, the homepage's 5-song sampler. **Gotcha:** `js/home-player.js` maps each entry to its album page by **array index** via a separate hardcoded `pages` array, not by data. If you add a 6th sampler entry, you must also add its page path to that `pages` array in `home-player.js` or it will silently link to `/`.
- `data/notes.js` → `window.RYDER_NOTES`, the "Notes from the Dirt Road" cards. Rendered by `js/notes-page.js`. Four card `type`s: `photo`, `note`, `quote`, `lyric`. `photo` cards support an optional `alt` field (falls back to the caption text if omitted — keep alt text short and descriptive, not the full post). `note` cards support an optional `link:{href,label}` field for a CTA.
- `data/albums/*.js` → `window.RYDER_ALBUM` per case-file album (track list, Field Notes HTML, cover art path). Glass Rose has its own inline data, not in this folder.

## Netlify config

- `netlify.toml` — minimal, just `pretty_urls = true`
- `_redirects` — clean-URL redirects (`/warning.html` → `/warning`) and legacy-name aliases. Add both when introducing a new page.
- `_headers` — HTML pages get `Cache-Control: public, max-age=0, must-revalidate` (so edits show up immediately); images/audio/JS/CSS get `max-age=3600`. **This means a page you just fixed can still look broken in a browser for up to an hour due to cached JS/assets — hard-refresh or use an incognito tab before concluding a fix didn't work.**
- `/.netlify/images?url=...` — Netlify's image-resizing CDN, used for hero backgrounds and thumbnails. **Only resolves on real Netlify infrastructure.** It will 404 on a local `python -m http.server` test — that's expected, not a bug.
- `netlify/edge-functions/*.js` — **these are dead code.** None of them have a `netlify.toml` route entry or an inline `export const config`, so Netlify never invokes them. Notably, `site-cleanup.js` describes a "police lights" effect for the Woods page that is **not** what actually runs — the real, working version is baked directly into `woods.html` as the `.blue-lights` CSS class. Don't trust the edge-functions folder as a description of current site behavior; check the actual page source.

## Git / deploy workflow

- Work on a narrowly-named feature branch (e.g. `fix/release-button-grid-layout`), never push non-trivial changes straight to `main`.
- Open a PR, **do not merge without explicit user approval** — this user reviews via Netlify's auto-generated Deploy Preview before merging.
- After pushing a branch and opening a PR, Netlify posts a `netlify/rydermccoy/deploy-preview` commit status — the real preview URL is there (pattern `https://deploy-preview-<PR#>--rydermccoy.netlify.app`, but confirm against what Netlify actually posts rather than assuming).
- **`git fetch origin <branch>` alone does NOT update the `origin/<branch>` local tracking ref** — it only updates `FETCH_HEAD`. This caused a real bug earlier in this project's history: merging `origin/<branch>` after that kind of fetch silently merged a stale, out-of-date ref, dropping most of a branch's commits. Either `git fetch origin` (no branch argument) or `git fetch origin +<branch>:refs/remotes/origin/<branch>` before merging/diffing against a remote branch.
- Before claiming a fix works, verify it — don't just read the diff and assume. This repo's history includes real bugs caught by actually testing: audio files referenced but never merged in, a form input whose `flex-basis` silently became a `height` once a media query switched it to `flex-direction:column`, an `<img>` that looked broken in a screenshot but was just native `loading="lazy"` not yet triggered. Spin up `python3 -m http.server` in the repo root and drive it with Playwright (Chromium is preinstalled at `/opt/pw-browsers/chromium`) rather than reasoning about CSS/JS from source alone.
- Never invent or placeholder external URLs (streaming links, API endpoints). If a value isn't supplied, omit that piece of UI rather than shipping a fake link — this has been the explicit standard throughout the project.

## Design system

CSS custom properties defined per-page (not a shared stylesheet — each page repeats the tokens): `--asphalt`/`--bg` (near-black background), `--bone` (body text), `--ash` (secondary/muted text), `--neon`/`--orange` and `--neon-hot`/`--gold` (accent), `--crimson`/`--red` (solid CTA buttons), `--line` (borders). Fonts: **Anton** for uppercase display headings, **Special Elite** (monospace typewriter) for labels/eyebrows/UI chrome, **Georgia** for body copy, **Caveat** (cursive) only on the Dirt Road page's handwritten-note cards. Square-edged buttons throughout — no `border-radius` on `.btn`. Keep new UI additions scoped to their own container class rather than editing the shared `.btn` rules, so a change to one section can't silently affect buttons elsewhere on the site.
