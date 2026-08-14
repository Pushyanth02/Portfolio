# Pushyanth ∞ — Portfolio

> **Build with AI. Ship with certainty.**
>
> A warm, cozy "sticker notebook" portfolio for **Pushyanth** — a CS/DSA student
> & software crafter building AI-powered, deterministic, self-hosted, explainable
> software. Maker of [Lemniscate](https://lemniscate2.vercel.app),
> [InfinityFG](https://infinityfg.vercel.app), and
> [Dungeoncore Necromancer](https://pushyanth02.github.io/Dungeoncore-Necromancer/).

---

## ✨ What's inside

- **Hero** — a self-drawing thesis, a live IST clock, an infinity doodle, and a
  vertical rotating role strip.
- **3 beliefs** — AI as a power tool, data staying home, building in the open.
- **AI workbench** — 13 models / agents / editors in active rotation, as
  hand-tilted stickers.
- **Work that shipped** — Lemniscate, InfinityFG, and Dungeoncore Necromancer,
  each with a "learnt…" reflection, tech tags, and honest impact stats.
- **Side quests** — GitHub profile README, DSA grind, achievement badges,
  open-source exploration.
- **Connect** — click-to-copy email (no mailto redirect), GitHub, LinkedIn.
- **A roaming infinity mascot** — wanders the viewport avoiding text, and does a
  cute bounce + heart/star burst + greeting bubble when you click it.
- **Marquees, 3D-tilt cards, count-up stats, scroll reveals** — all respecting
  `prefers-reduced-motion`.

## 🎨 Design system

| Token | Value | Use |
|------|-------|-----|
| `--cream` | `#F5EFE3` | base background — warm paper |
| `--card` | `#FBF6EC` | card surfaces |
| `--ink` | `#201A14` | primary text, borders, dark sections |
| `--coral` | `#E8603C` | primary accent — links, CTAs, highlights |
| `--leaf` | `#3E7C4F` | "privacy / self-hosted" accent |
| `--sun` | `#F2B33D` | "connect" + workbench accent |
| `--sun-soft` | `#FBE7B6` | workbench background |

**Type**

- **Display:** Fraunces (600/700, +italic) — headlines.
- **Body:** Epilogue (400/500/600) — prose.
- **Mono:** Space Mono (400/700) — labels, stats, metadata.

**Layout language:** hard 1.5px ink borders, offset `Npx Npx 0 ink` shadows,
hand-set rotations (±0.5–2°), and `cubic-bezier(.16,1,.3,1)` easing throughout.
All images sit in `object-fit: contain` frames so illustrations are always
fully visible.

## 🧱 Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, static export)
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 (CSS-first config in `globals.css`)
- **Fonts:** Fraunces, Epilogue, Space Mono (`next/font/google`)
- **Toast feedback:** [sonner](https://sonner.emilkowal.ski/)
- **Icons:** hand-built inline SVG set (`src/components/site/icons.tsx`)
- **No database, no API routes, no server runtime.** Fully static — deploy anywhere.

### Dependencies

The project is deliberately minimal — only 7 runtime dependencies:

| Package | Purpose |
|---------|---------|
| `next` | Framework (App Router, static export) |
| `react` / `react-dom` | UI runtime |
| `sonner` | Toast notifications |
| `next-themes` | Theme hook for the toaster |
| `clsx` + `tailwind-merge` | `cn()` class merge helper |

Dev dependencies are just TypeScript, ESLint, Tailwind, and Bun types.

## 🚀 Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [Bun](https://bun.sh/) (recommended) — or npm/yarn/pnpm

### Install & run

```bash
bun install        # install dependencies
bun run dev        # start the dev server on http://localhost:3000
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the dev server on port 3000 |
| `bun run build` | Static export → `out/` directory |
| `bun run preview` | Build + serve `out/` locally |
| `bun run lint` | Run ESLint |

## 📁 Project structure

```
.
├── .github/workflows/deploy.yml   # GitHub Pages CI/CD (auto basePath)
├── .vscode/                       # VS Code workspace (settings, tasks, launch, extensions)
├── public/
│   ├── art/                       # All illustrations (local, self-contained)
│   ├── favicon.svg                # Coral infinity favicon
│   ├── .nojekyll                  # Lets GitHub Pages serve _next/ assets
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── globals.css            # Design tokens + all component styles
│   │   ├── layout.tsx             # Root layout (fonts, metadata, toaster)
│   │   └── page.tsx               # Home page — section orchestrator
│   ├── components/
│   │   ├── site/                  # Portfolio components (hero, work, rover, …)
│   │   └── ui/sonner.tsx          # Themed toaster
│   └── lib/utils.ts               # cn() class merge
├── eslint.config.mjs             # Flat ESLint config (Next.js + TS presets)
├── next.config.ts                 # Static export + basePath config
├── package.json                   # 7 runtime deps, minimal & audited
├── tsconfig.json                  # Strict TypeScript
├── LICENSE                        # MIT
└── README.md
```

> **Sandbox-independent.** No external CDNs, no gateway, no database, no API
> routes. All illustrations are local. The repo contains only the portfolio —
> 43 tracked files, zero scaffolding.

## 🌐 Deployment

### GitHub Pages (recommended)

The repository ships with a ready-to-use GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds the static export and deploys it
to GitHub Pages on every push to `main`.

**One-time setup:**

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**
   and select **GitHub Actions**.
3. Push to `main`. The workflow runs `bun run build` with
   `NEXT_PUBLIC_BASE_PATH` automatically derived from the repo name, then
   deploys the `out/` folder.

- **Project site** (`username.github.io/<repo>`) → `basePath = /<repo>` (auto).
- **User site** (`username.github.io`) → `basePath = ""` (auto-detected).
- Custom domain → leave `NEXT_PUBLIC_BASE_PATH` unset.

Your site will be live at `https://<username>.github.io/<repo>/`.

### Other static hosts (Netlify, Cloudflare Pages, Vercel)

- **Build command:** `bun run build`
- **Output directory:** `out`
- **Environment:** leave `NEXT_PUBLIC_BASE_PATH` unset for root-domain hosting.

### Local preview of the production build

```bash
bun run build
bunx serve out -p 3000     # then open http://localhost:3000
```

## ♿ Accessibility & motion

- WCAG-minded contrast, semantic HTML, ARIA labels on all interactive elements.
- Visible coral focus rings (`:focus-visible`).
- A "skip to work" link for keyboard users.
- `prefers-reduced-motion` is respected everywhere — the roaming infinity,
  marquees, reveals, and tilt effects all disable/quiet down.

## 📝 License

[MIT](./LICENSE) — © 2025 Pushyanth. Illustrations generated in-house.
