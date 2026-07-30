# jamesoverholt.com

Personal + business site for James Overholt — data, software & growth consulting.
Static site (no build step) with a Supabase-backed contact form. Deploys to
Cloudflare Pages, same stack pattern as tripvibz.com.

## Stack
- **Frontend:** single static `public/index.html` (vanilla HTML/CSS/JS, no framework, no build)
- **Backend:** Supabase (Postgres + REST) — stores contact-form leads
- **Hosting:** Cloudflare Pages
- **Source control:** Git

## Structure
```
jamesoverholt/
├─ public/                     ← Cloudflare Pages "build output" / root
│  ├─ index.html               ← the whole site
│  ├─ james-headshot.jpg       ← add your photo here (see README-headshot.txt)
│  ├─ robots.txt, sitemap.xml
│  ├─ _headers, _redirects     ← Cloudflare Pages config
├─ supabase/
│  └─ migrations/0001_create_contact_submissions.sql
├─ .gitignore
└─ README.md
```

## Supabase (already provisioned)
- **Project ref:** `xeybjpnkepmaobhawngo`
- **Project URL:** `https://xeybjpnkepmaobhawngo.supabase.co`
- **Publishable key (safe in client code):** `sb_publishable_nCnSX0ZJY7ics63iQg901Q_N4nX7Nt1`
- **Table:** `public.contact_submissions` with **row-level security**: anonymous
  visitors can *insert* (submit the form) but cannot *read* anyone's data.
  You read leads in the Supabase dashboard → Table Editor → `contact_submissions`.

These values are already baked into `public/index.html` (the `SUPABASE_URL` /
`SUPABASE_KEY` constants near the bottom). The publishable key is designed to be
public; RLS is what protects the data.

### Read your leads
Supabase Dashboard → project **jamesoverholt** → Table Editor → `contact_submissions`.
(Optional: turn on email alerts via a Database Webhook or a Supabase Edge Function.)

## Deploy to Cloudflare Pages
1. Push this folder to a new Git repo (GitHub/GitLab).
   ```bash
   cd jamesoverholt
   git init && git add . && git commit -m "Initial site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `public`
4. Deploy. You'll get a `*.pages.dev` URL.
5. **Custom domain:** Pages project → Custom domains → add `jamesoverholt.com`
   and `www.jamesoverholt.com`. Point your DNS (Cloudflare) at the Pages project.

## Local preview
```bash
cd public
python3 -m http.server 8080
# open http://localhost:8080
```

## Editing content
Everything lives in `public/index.html`. Copy blocks are plain HTML — edit the
hero, About, Services, Work, and Contact sections directly. No rebuild needed;
just commit and push, and Cloudflare redeploys automatically.

## Notes on EEAT
The `<head>` includes JSON-LD `Person` structured data with `sameAs` links to
your LinkedIn, Facebook, TheSmokies author profile, and MiamiTake — this helps
search engines connect this site to your verified identity and strengthens the
authority signals across your properties.
