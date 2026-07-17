---
name: verify
description: Build/launch/drive recipe for verifying adamaas changes in the running app (Next 16 + Payload 3 on bun).
---

# Verifying adamaas changes

## Launch

The user's dev server is usually already running on port 3000 (`next dev`
refuses to start twice — check first instead of launching your own):

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If nothing is running: `bun run dev` (background). `.env.local` at the repo
root supplies the local Postgres connection (there is no `.env`; `payload run`
scripts only read `.env`, so temp-symlink it: `ln -sf .env.local .env`, run,
`rm .env`). Local DB is dev-push — never run `payload migrate` locally.

Gotcha: `next build` / `next start` run with NODE_ENV=production, which loads
`.env.production.local` (real production credentials) at HIGHER precedence
than `.env.local`. Before a local prod-mode session, move it away
(`mv .env.production.local /tmp/...`) and restore it after — otherwise the
build prerenders from, and the server mutates, the production Neon DB. Verify
which DB a prod-mode server is on before writing:
`curl -s localhost:3000/api/products?limit=10` (local DB has extra test docs).

## Drive

Use the Playwright MCP tools against `http://localhost:3000`. Key routes:
`/product/nomad` (product page), `/shop/1`, `/blog`, `/services`.

Playwright screenshots save relative paths to the repo root — move them to
the scratchpad afterwards, and remove `.playwright-mcp/`.

## Seeding data for a probe

Content lives in the local Postgres DB; the `nomad` product often lacks
optional fields (images, etc.). To exercise data-dependent UI, write a
throwaway script using the Payload local API and run it with:

```bash
bunx payload run scripts/<probe>.ts
```

Pattern: `getPayload({ config })` from `../src/payload.config`, pass
`context: { disableRevalidate: true }` to create/update (revalidatePath
throws outside a Next request), generate test images with `sharp` (already
a dependency), and `process.exit(0)` at the end. Clean up seeded docs and
delete the script when done — see `scripts/upsert-nomad.ts` for the style.

Gotcha: never re-upload a changed image under a filename used earlier in
the session — both the browser and Next's image optimizer cache by URL, so
the page silently shows the old file. Use a fresh filename per seed run.

Gotcha: renaming a collection field makes drizzle ask an interactive
"created or renamed?" question in every process that pushes schema —
`payload migrate:create`, `payload run` scripts, and the dev server itself.
Drive CLI runs inside `tmux -L <name>` and answer with Down+Enter (the
question repeats for the DOWN migration). If the dev server hangs on every
route after a field rename, it is blocked on that hidden prompt — restart
it once the DB is already renamed and it comes up clean.
