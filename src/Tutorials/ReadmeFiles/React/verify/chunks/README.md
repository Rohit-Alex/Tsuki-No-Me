# Chunking + content hashing demo — Module 14a

`main` → `home` → `shared`, and `dashboard` (dynamically imported) → `shared`.

```bash
npx esbuild src/main.js --bundle --minify --splitting --format=esm \
  --entry-names='[name]-[hash]' --chunk-names='chunk-[hash]' --outdir=dist
```

## Chunks emitted

```
chunk-ES2H7ROY.js    51 bytes   ← shared.js (used by 2 chunks → its own file)
chunk-EVWUNHCL.js    99 bytes   ← dashboard.js (behind import(), lazy)
main-LGHX4FMV.js    207 bytes   ← entry
```

## Content hashing preserves cache

Change **only** `dashboard.js` and rebuild:

```
BUILD 1                   BUILD 2
chunk-ES2H7ROY.js         chunk-ES2H7ROY.js   ← SAME filename, still cached
chunk-EVWUNHCL.js         chunk-TUJD7DQS.js   ← changed
main-LGHX4FMV.js          main-74AQNMGT.js    ← changed (import path inside it)
```

The shared chunk keeps its name, so returning users don't re-download it.
