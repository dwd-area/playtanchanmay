# PlayTogether

Private multiplayer hangout and games platform for 6–10 friends.

**Stack:** React + TypeScript + Vite + Tailwind · Supabase (Postgres, Anonymous Auth, Realtime, Storage, Edge Functions) · Cloudflare Turnstile (CAPTCHA) · Gemini API (via Edge Function) · Cloudflare Pages (hosting)

---

## 1. Prerequisites

- Node.js 20+
- Docker Desktop (runs local Supabase)
- Supabase CLI (`npm i -D supabase`, then use `npx supabase ...`)
- Optional: a Gemini API key from Google AI Studio (only for the AI Corner)

---

## 2. Run locally (no cloud)

```bash
npm install
npx supabase init            # only if supabase/config.toml does not exist
```

### 2.1 Configure local Supabase

Edit `supabase/config.toml`. Edit the existing `[auth]` table, do not duplicate it:

```toml
[auth]
enable_anonymous_sign_ins = true

[auth.captcha]
enabled = true
provider = "turnstile"
secret = "env(TURNSTILE_SECRET)"
```

Create `supabase/.env` with Cloudflare's always-pass **test** secret:

```bash
TURNSTILE_SECRET=1x0000000000000000000000000000000AA
```

### 2.2 Start the backend

```bash
npx supabase start           # applies everything in supabase/migrations
npx supabase status          # prints API URL and anon/publishable key
```

Local URLs: API `http://127.0.0.1:54321` · Studio `http://127.0.0.1:54323`

### 2.3 Frontend env

Create `.env.local`:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon key from supabase status>
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

### 2.4 Run

```bash
npm run dev                  # http://localhost:5173
```

### 2.5 AI Corner locally (optional)

Create `supabase/functions/.env`:

```bash
GEMINI_API_KEY=<your key>
GEMINI_MODEL=<free-tier model name from AI Studio>
```

```bash
npx supabase functions serve ai-generate --env-file supabase/functions/.env
```

### 2.6 Manual test checklist

Use one normal window and one incognito window. Each has its own anonymous identity.

1. Window A: enter a name, click **Create room**, copy the code from the URL.
2. Window B: enter a different name, paste the code, click **Join room**.
3. Both appear in the member list (presence).
4. Send chat messages from both sides.
5. Start Tic-Tac-Toe. Moves sync and only the player whose turn it is can move.
6. Close window B and reopen it. It reconnects and the game state is restored.
7. Window C (a third identity) joins the same room. It sees the room but cannot read data from other rooms.
8. Optional: with the function running, test the AI Corner button.

### 2.7 Stop the dev environment

Run every `npx supabase ...` command from the project folder (where `supabase/config.toml` lives).

| What | How |
|---|---|
| Frontend (`npm run dev`) | Press `Ctrl+C` in its terminal |
| AI function (`functions serve`) | Press `Ctrl+C` in its terminal |
| Local Supabase (Docker) | `npx supabase stop` |
| Docker Desktop | Quit it from the tray icon (optional, frees RAM) |

`npx supabase stop` keeps your data (it lives in Docker volumes). To wipe it:

```bash
npx supabase stop --no-backup   # stop and delete all local data
npx supabase db reset           # keep running, rebuild DB from migrations
```

Nothing auto-starts after a reboot. To resume: start Docker Desktop, then `npx supabase start`, then `npm run dev`.

If `supabase start` fails with "port is already allocated", an old project is still running. Run `npx supabase stop` from its folder, or list leftovers with `docker ps --filter "name=supabase_"` and remove them with `docker rm -f <name>`.

---

## 3. Deploy

### 3.1 Supabase (cloud)

1. Create a project at supabase.com.
2. Link and push the schema:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
3. Dashboard → Authentication:
   - Enable **Anonymous sign-ins**.
   - Enable **CAPTCHA protection**, choose Turnstile, paste your real secret key.
4. Set secrets and deploy the function:
   ```bash
   npx supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=...
   npx supabase functions deploy ai-generate
   ```
5. In `supabase/functions/ai-generate/index.ts`, replace `Access-Control-Allow-Origin: '*'` with your site's domain.

### 3.2 Cloudflare Turnstile

1. Cloudflare dashboard → Turnstile → add a widget.
2. Add your production hostname, e.g. `playtogether.pages.dev`.
3. Site key goes in `VITE_TURNSTILE_SITE_KEY`. Secret key goes in Supabase's CAPTCHA settings.

### 3.3 Cloudflare Pages

1. Push the repo to GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → connect the repo.
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variables (build-time):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TURNSTILE_SITE_KEY`
5. `public/_redirects` already contains the SPA fallback (`/*  /index.html  200`).

### 3.4 Keep the free Supabase project awake

Free projects pause after about a week of inactivity. Add `.github/workflows/keepalive.yml`:

```yaml
name: keepalive
on:
  schedule: [{ cron: '0 3 */3 * *' }]
  workflow_dispatch:
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS "${{ secrets.SUPABASE_URL }}/rest/v1/" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" > /dev/null
```

Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as repository secrets.

---

## 4. Project structure

```text
supabase/migrations/    schema, RLS, RPC functions, storage policies
supabase/functions/     ai-generate (Gemini proxy with per-user daily quota)
src/lib/                Supabase client
src/features/           auth, rooms (realtime channel), chat, gallery, ai
src/games/              GameModule interface, registry, useGame, per-game folders
src/themes/             CSS-variable tokens, ThemeProvider (modern / retro)
src/pages/              Landing, Lobby, Room, Library, AiCorner
```

## 5. Add a new game

1. Create `src/games/<name>/` with `logic.ts` (pure `init` and `reduce`), `View.tsx`, `index.ts`.
2. Export a `GameModule` and add it to `src/games/registry.ts`.
3. Set `defaultTheme` to `'modern'`, `'retro'` or `'inherit'`.

Games with hidden information (Werewolf) must keep state in an Edge Function and send each player only their own slice. Do not use the client-hosted `useGame` for them.

## 6. Security notes

- All tables have RLS. Room data is visible only to members via `is_room_member()`.
- Realtime channels are private (`room:<uuid>`) and guarded by policies on `realtime.messages`.
- Images are stored in a private bucket under `<room_id>/<user_id>/...` and served by signed URLs.
- The Gemini key exists only as an Edge Function secret.
- Client-hosted game logic can be cheated by the host. This is acceptable for friends, not for competitive play.

## 7. Free-tier limits to watch

- Supabase: project pausing, about 500 MB database, about 1 GB storage, Realtime connection and message limits.
- Gemini: model names and limits change. Check AI Studio before choosing `GEMINI_MODEL`.
- Turnstile and Cloudflare Pages: generous free limits, no action needed.

## 8. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Sign-in fails with captcha error | Turnstile keys do not match the environment (use the test keys locally) |
| Chat does not update live | Chat reloads via the room channel (`chat:new`); check the room shows `(online)` |
| "Anonymous sign-ins are disabled" | `enable_anonymous_sign_ins = true` missing in `config.toml`; restart with `npx supabase stop` then `start` |
| "port is already allocated" | Another Supabase project is running; stop it (see 2.7) |
| `ROOM_NOT_FOUND` on join | Code typed wrong, or the room was created in a different Supabase instance |
| Channel never reaches `online` | Realtime policies missing, or the user is not a room member |
| AI returns 429 | Daily per-user quota reached (`consume_ai_quota`) |
| AI returns 502 | Bad `GEMINI_MODEL` or API key, or Gemini rate limit |
| `@/` imports fail | Alias missing in `vite.config.ts` or `tsconfig.json` |