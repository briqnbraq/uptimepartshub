# UptimePartsHub — Supply Portal

Performance nutrition & functional food drop-ship / white-label portal.
Built with React (CRA) → deployed to Cloudflare Pages (free tier).

---

## Stack

| Layer      | Tech                          | Cost        |
|------------|-------------------------------|-------------|
| Framework  | React 18 (Create React App)   | Free        |
| Hosting    | Cloudflare Pages              | Free        |
| DNS        | Cloudflare (uptimepartshub.com) | ~$10/yr   |
| Forms      | Formspree (or CF Worker)      | Free tier   |

---

## Local Setup (Alma Linux)

```bash
# 1. Install Node if not already present
sudo dnf module enable nodejs:20
sudo dnf install nodejs -y
node -v   # should be 20.x

# 2. Scaffold (first time only)
npx create-react-app uptimepartshub
cd uptimepartshub

# 3. Replace generated files with the project files
#    (copy src/ and public/ from this repo into the CRA folder)

# 4. Run dev server
npm start
# → http://localhost:3000
```

---

## Build for Production

```bash
npm run build
# Output → build/  (static files, ready for Cloudflare Pages)
```

---

## Deploy to Cloudflare Pages

### Option A — Git (recommended, auto-deploys on push)

1. Push this repo to GitHub / GitLab
2. Log in to dash.cloudflare.com → Pages → Create a project
3. Connect your repo
4. Build settings:
   - **Framework preset**: Create React App
   - **Build command**: `npm run build`
   - **Build output directory**: `build`
5. Save & Deploy → Cloudflare builds and publishes automatically

### Option B — Direct Upload (no Git required)

```bash
npm run build
npx wrangler pages deploy build --project-name=uptimepartshub
```

---

## Custom Domain (portal.uptimepartshub.com or apex)

1. In Cloudflare Pages → your project → Custom domains
2. Add `uptimepartshub.com` or `portal.uptimepartshub.com`
3. Cloudflare auto-provisions SSL — done.

---

## Contact Form (Production Wiring)

The form currently logs to console. To wire it up:

### Easiest: Formspree (free tier = 50 submissions/mo)
1. Sign up at formspree.io → create a form → get your endpoint
2. In `src/App.jsx`, find the `handleSubmit` function and replace:

```js
// Replace the console.log line with:
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

### Scale-up: Cloudflare Worker (free, no third party)
Create a Worker that receives POST → sends email via Mailchannels or Resend.

---

## Environment Variables

None required for the base app. If you add integrations later:
- Create `.env.local` (never commit this)
- Use `REACT_APP_` prefix for any CRA env vars

---

## Folder Structure

```
uptimepartshub/
├── public/
│   ├── index.html          ← Google Fonts loaded here
│   └── _redirects          ← Cloudflare Pages SPA routing
├── src/
│   ├── index.js            ← React entry point
│   ├── index.css           ← Global styles, CSS variables, keyframes
│   ├── App.jsx             ← All sections + data arrays
│   └── App.css             ← Component styles
└── package.json
```

---

## Similarities to Briq-n-Braq Portal

Same pattern:
- Single JSX file for all components
- CSS variables for brand tokens
- `useInView` hook for scroll animations
- Cloudflare Pages free tier
- `_redirects` for SPA routing
- Google Fonts via `<link>` in index.html (no npm package)

---

## Next Steps

- [ ] Wire contact form (Formspree or CF Worker)
- [ ] Add real product catalog data (replace mock SKU counts)
- [ ] Integrate Shopify Storefront API for live catalog browsing
- [ ] Add `/catalog` route with React Router if multi-page needed
- [ ] Set up analytics with Cloudflare Web Analytics (free, no cookies)
# UptimePartsHub
