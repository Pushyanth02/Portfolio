# Pull Request

## Description

<!-- What changed, and why? Link related issues. -->

## Checklist

- [ ] **Mode parity** — the change was made in BOTH universes (student sticker-notebook + dev terminal), or intentionally scoped to one
- [ ] **Lint clean** — `bun run lint` passes with no new warnings
- [ ] **Mobile + desktop verified** — checked at ~390px and ≥1280px, dock and footer clearances intact, no horizontal overflow
- [ ] **Reduced motion respected** — `prefers-reduced-motion` path still works (fold collapses to a crossfade, reveals stay visible)
- [ ] Static export still builds (`bun run build` → `out/`) if app/config files were touched
