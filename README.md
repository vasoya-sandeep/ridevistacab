# ColdCore — PWA Install Demo

A small, self-contained web app built specifically to demo **one thing well**: what it feels like for a customer to install this monitoring dashboard on their phone straight from the browser, no app store involved.

It's plain HTML/CSS/JS (no Angular build step), so it's zero-setup — open it, host it, done. The full Angular 20 build from the spec can reuse this manifest, service worker, and install-flow logic as-is.

## Why this is a separate mini-build

Real "Add to Home Screen" installability only works over **HTTPS** (or `localhost`) — never over `file://`. So the fastest path to a real phone demo is a tiny static site you can deploy in under a minute, rather than waiting on the full Angular project + build pipeline.

## Deploy it (pick one, all free, all ~60 seconds)

**Netlify Drop** — easiest for a live demo today
1. Go to https://app.netlify.com/drop
2. Drag this whole folder in
3. You get a live `https://…netlify.app` URL immediately — open it on your phone

**GitHub Pages**
1. Push this folder to a repo
2. Settings → Pages → deploy from the `main` branch
3. Visit `https://<you>.github.io/<repo>`

**Vercel**
1. `npx vercel` from inside this folder

## Demo script for the customer

**On Android (Chrome):**
1. Open the URL
2. Tap the **Install App** button on the dashboard itself (this is the `beforeinstallprompt` flow — same mechanism as the Play Store "Install" but skipping the store)
3. Confirm — icon lands on the home screen, launches full screen, no browser bar

**On iPhone (Safari):**
Safari doesn't support the automatic prompt, so the app detects iOS and shows on-screen steps instead: Share → Add to Home Screen → Add. Worth narrating this distinction to the customer — it's a real iOS platform limitation, not a bug in the build.

**Then show:**
- Turn on airplane mode → dashboard still opens and shows data (service worker cache)
- Relaunch from the home screen icon → no browser chrome, feels native
- Point out the theme-colored status bar and splash background — comes from `manifest.json`

## Login

The app now opens on a sign-in screen before the dashboard, so a demo feels like a real application rather than a single open page.

- **Username:** `admin`
- **Password:** `admin123`
- "Remember me" keeps the session after the browser/app is closed; unchecked, it clears when the tab closes
- Logging out (top-right icon on the dashboard) clears the session and returns to the login screen
- This is dummy client-side auth for the demo only — no real backend, no encryption. Wire it to a real API before this goes anywhere near production.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | App identity, icons, colors, `display: standalone`, launches on `login.html` |
| `service-worker.js` | Offline caching + auto-update on next launch |
| `login.html` / `auth.js` | Sign-in screen and dummy auth check |
| `index.html` / `styles.css` / `app.js` | Dashboard shell + the install-prompt logic + logout |
| `icons/` | 192/512/maskable PNGs + iOS touch icon |

## Carrying this into the full Angular build

Angular's PWA schematic (`ng add @angular/pwa`) generates an equivalent `ngsw-config.json` + manifest. The install-button logic in `app.js` (listening for `beforeinstallprompt`, detecting iOS, detecting standalone mode) ports directly into an Angular service with no changes to the approach.
