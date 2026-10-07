# Hamro Bazaar — Phase 1 (working directory)

Pittsburgh-first service platform for the Nepali + Indian diaspora. Free directory,
paid featured placement later. Mobile-first, bilingual (EN/नेपाली), WhatsApp-first.

Design + content spec: `../research_notes/hamro-bazaar-sample/report.md` (law).
Sample landing (visual reference only): hosted artifact slug `hamro-bazaar`.

## Structure

```
hamro-bazaar/
├── src/
│   ├── data/
│   │   ├── listings.json        # 84 real listings (git-backed "database")
│   │   └── announcements.json   # announcements feed
│   ├── lib/
│   │   ├── db.js                # ONLY module that reads the JSON — swap for a DB client later
│   │   ├── i18n.js              # EN/NE dictionary + toggle logic
│   │   └── format.js            # tel:/wa.me/maps link builders (QA-verifiable)
│   ├── styles/global.css         # design tokens (10 colors / 8 font sizes — keep the census)
│   ├── components/              # ListingCard, CategoryGrid, AnnouncementCard
│   ├── layouts/Base.astro        # header, tab bar, footer, lang + SW bootstrap
│   │   └── pages/
│   │       ├── index.astro          # home: hero search, categories, featured rail, announcements, owner CTA
│   │       ├── browse.astro         # filters (category, neighborhood, open-now), result cards
│   │       ├── business/[id].astro  # detail sheet + review form + approved reviews
│   │       ├── announcements.astro  # feed (+ link to /announce)
│   │       ├── announce.astro       # public announcement submission form
│   │       ├── feature.astro        # featured placement ($25/mo) + request form
│   │       ├── request.astro        # service-request form -> prefilled WhatsApp deep link
│   │       ├── list-business.astro  # owner onboarding explainer (WhatsApp done-for-you)
│   │       └── admin.astro          # admin panel (listings + announcements + submissions)
│   ├── api/                         # Vercel serverless functions (NOT Astro routes)
│   │   ├── admin-login.js           # POST {key} -> httpOnly session cookie (HMAC, 7-day)
│   │   ├── admin-logout.js
│   │   ├── submit-announcement.js   # PUBLIC: announcement -> moderation queue
│   │   ├── submit-review.js         # PUBLIC: review for a listing -> moderation queue
│   │   ├── submit-featured.js       # PUBLIC: featured request -> moderation queue
│   │   ├── lib/
│   │   │   ├── auth.js              # stateless session create/verify, JSON body reader
│   │   │   ├── github.js            # getJsonFile / putJsonFile via GitHub REST
│   │   │   ├── validate.js          # server-side validation (admin + public)
│   │   │   └── ratelimit.js         # best-effort in-memory per-IP limit (public writes)
│   │   └── admin/
│   │       ├── listings.js          # GET list · POST add/update · DELETE
│   │       ├── featured.js          # POST {id, featured}
│   │       ├── verify.js            # POST {id, verified}
│   │       ├── announcements.js     # GET list · POST add
│   │       ├── announcements/publish.js  # POST {id, published}
│   │       └── submissions.js       # GET queue · POST {id, action: approve|reject}
│   ├── src/data/
│   │   ├── listings.json            # 84 real listings; reviews appended on approval
│   │   ├── announcements.json       # announcements feed
│   │   └── submissions.json         # moderation queue (pending/approved/rejected)
├── public/
│   ├── manifest.json            # PWA manifest (standalone, theme #8c2b2b)
│   ├── sw.js                    # best-effort service worker (never breaks the page)
│   ├── offline.html             # offline fallback with staleness note
│   └── icons/                   # maroon/gold bazaar mark (SVG)
├── .env.example                 # documents ADMIN_KEY, GITHUB_TOKEN, PUBLIC_WHATSAPP_NUMBER
└── astro.config.mjs             # output: 'static'
```

## How data flows

**Read path (public site):** pages import `src/lib/db.js`, which reads the JSON files at
build time. Astro prerenders everything to `dist/`. No runtime database in Phase 1.

**Write path (admin):** `/admin` login sets an httpOnly HMAC session cookie (7 days).
Admin UI calls `/api/admin/*`, which:
1. verifies the session cookie (`api/lib/auth.js`),
2. validates input server-side (`api/lib/validate.js`),
3. reads the current JSON from GitHub, applies the change, and commits it back
   (`api/lib/github.js`, committer `baby-zack-agent`),
4. the commit triggers a Vercel redeploy (~1 min) and the live site rebuilds.

To swap in a real database later: rewrite `src/lib/db.js` internals and point the
`/api/admin/*` functions at it. Pages and components don't change.

## Local dev

```bash
npm install
npm run dev        # http://localhost:4321
```

Public env for dev: create `.env` from `.env.example`. `PUBLIC_WHATSAPP_NUMBER` enables
the request/list-business WhatsApp deep links (international format, no `+`).
Admin API routes need `ADMIN_KEY` + `GITHUB_TOKEN` to do real writes; without them the
public site still builds and runs fine.

## Env vars (Vercel project settings)

| Var | Scope | Purpose |
|---|---|---|
| `ADMIN_KEY` | server | password for `/admin` (long random string) |
| `GITHUB_TOKEN` | server | PAT with `repo` contents-write, for data commits |
| `GITHUB_REPO` | server | default `baby-zack-agent/hamro-bazaar` |
| `GITHUB_BRANCH` | server | default `main` |
| `PUBLIC_WHATSAPP_NUMBER` | public | WhatsApp deep-link target, e.g. `14125550123` |

No secrets are committed. `.env` is gitignored.

## Deploy to Vercel (exact steps)

1. Create the GitHub repo `baby-zack-agent/hamro-bazaar` (private is fine) and push this
   directory to `main`.
2. Vercel → Add New Project → import the repo.
   - Framework preset: **Astro**
   - Build command: `npm run build` (or `astro build`)
   - Output directory: `dist`
   - Install command: `npm install`
   - The `api/` directory is picked up automatically as serverless functions.
3. Project Settings → Environment Variables: set the five vars above.
4. Deploy. Verify: `/` loads, `/browse` filters, `/admin` login works with `ADMIN_KEY`.
5. (Later) add the custom domain in Vercel → Domains.

## Notes / honest limitations (v1)

- **Open-now filter** is backed by owner-reported `hours` only; listings without hours are
  excluded rather than guessed. Real open-now needs structured hours (Phase 2).
- **Reviews** are community-submitted and moderated (approve in `/admin` → Submissions).
  Nothing shows without approval.
- **Payments** for featured placement are manual (Zelle/Venmo tracked outside the app)
  until a verified payment rail exists. `/feature` explains the deal and queues requests.
- **WhatsApp intake** is human-operated (the agent) in Phase 1; the Business Cloud API
  needs Meta business verification (Phase 3).
- Announcement seed content is placeholder copy for the demo feed, not real business posts.
- **Rate limiting** on public write endpoints is in-memory per serverless instance
  (best effort). Determined abuse needs a shared store (Phase 3).

## Phase 2 — community features (this build)

- **Public submissions:** `/announce` (announcements), review form on every business page,
  `/feature` (featured placement requests). All POST to public `/api/submit-*` routes with
  server-side validation, a honeypot field, and per-IP rate limiting (5/hour, best effort).
  Submissions land in `src/data/submissions.json` as `{type, status:"pending"}` via the
  same GitHub-commit write path. No login, no account — but nothing goes live unreviewed.
- **Moderation:** `/admin` → Submissions tab lists the queue newest-first with a pending
  count badge. Approve → announcement appended to `announcements.json` (published),
  review appended to the listing's `reviews` array, featured-request just marked approved
  for manual follow-up. Reject → marked rejected. All through HMAC admin auth.
- **Featured placement:** `/feature` explains $25/mo (top of category, homepage carousel,
  gold badge), manual Zelle/Venmo payment instructions, and a request form. Linked from
  business pages ("Feature this business") and the home owner CTA band.
- Submitted announcements carry the author's text in both language slots until translated;
  the agent can refine the Nepali via the Announcements admin tab.
