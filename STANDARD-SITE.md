# standard.site compatibility

This site is wired up for [standard.site](https://standard.site) — a small set
of AT Protocol lexicons for long-form publishing, so the site's pages can be
indexed and distributed across the atmosphere without a central gatekeeper.

## What's in the repo

| File | Purpose |
| --- | --- |
| `standard.config.json` | Declares the publication (URL, name, description, icon) and which pages are documents. |
| `scripts/sync-standard.mjs` | Creates/updates the AT Protocol records and regenerates the artifacts below. No dependencies (Node 20+). |
| `.well-known/site.standard.publication` | Verification file — holds the publication record's AT-URI. Auto-populated by the sync. |
| `standard-mapping.json` | Remembers record keys so re-runs update records instead of duplicating them. Created on first sync. |
| `.github/workflows/standard-site.yml` | Runs the sync on every push to `main` and commits the regenerated artifacts back. |
| `.nojekyll` | Lets GitHub Pages serve the dotted `.well-known/` directory. |

Each page listed in `standard.config.json` gets a
`<link rel="site.standard.document" href="at://…">` tag injected into its
`<head>` (between `<!-- standard.site -->` markers), which is how standard.site
verifies document ownership.

## One-time setup

The records live under your AT Protocol (Bluesky) identity, so the workflow
needs your handle and an app password:

1. **App password** — create one at <https://bsky.app/settings/app-passwords>.
2. In the repo: **Settings → Secrets and variables → Actions**
   - **Variables** tab → New variable: `BLUESKY_HANDLE` = your handle (e.g. `ronbronson.dev`).
   - **Secrets** tab → New secret: `BLUESKY_APP_PASSWORD` = the app password.
   - *(Optional)* Variable `BLUESKY_SERVICE` if you self-host a PDS (defaults to `https://bsky.social`).
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The first run resolves your DID automatically, creates the publication +
document records, writes the real AT-URIs into the `.well-known` file and the
page `<head>`s, and commits the result. Until the handle/password are set the
workflow is a harmless no-op.

## Running it locally

```sh
BLUESKY_HANDLE=ronbronson.dev BLUESKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx \
  node scripts/sync-standard.mjs

# preview document discovery and titles without touching the network:
node scripts/sync-standard.mjs --dry-run
```

New project pages under `projects/*.html` are picked up automatically. Override
any auto-extracted title/description/date per page via `documents.overrides` in
`standard.config.json`.
