<div align="center">

# Pushyanth ∞ — Portfolio

**Two universes, one URL: a warm sticker-notebook student world and a dark phosphor dev terminal, folded together by an animated Infinity Fold.**

[Live site](https://pushyanth02.github.io/Portfolio/) · [About the fold](#two-universes-one-url) · [Getting started](#getting-started) · [Deploy](#deployment-github-pages)

<p>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5_strict-3E7C4F?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5 (strict)">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-F2B33D?style=flat-square&logo=tailwindcss&logoColor=201A14" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/License-MIT-3E7C4F?style=flat-square" alt="License: MIT">
  <img src="https://img.shields.io/badge/deploy-GitHub_Pages-2EA44F?style=flat-square&logo=github&logoColor=white" alt="Deploy: GitHub Pages">
</p>

</div>

---

The personal portfolio of **Vulavala Pushyanth Reddy** — CS undergrad and full-stack developer from Bangalore, India — built as a single Next.js page that renders **two complete interfaces for the same content** and transitions between them with a page-turn animation called the Infinity Fold.

## Two universes, one URL

The site boots in the **student** universe: a warm, tactile sticker notebook (cream `#F5EFE3` paper, coral `#E8603C`, leaf `#3E7C4F`, sun `#F2B33D`) with taped polaroids, sticker chips and a roaming infinity mascot. Tap the **∞ tile at the end of either dock** and reality folds: an iris sheet opens from the exact tap point, a large infinity glyph sweeps across the cover, and the page reopens in the **dev** universe — a dark terminal (`#0B0E11`, phosphor green `#7EE787`) where every section is a terminal window, every heading a `$` prompt, and the certificates live in `~/certs`.

| | Student (default) | Dev |
| :--- | :--- | :--- |
| **Skin** | Sticker notebook — paper, tape, offset ink shadows | Terminal — windows, prompts, phosphor glow |
| **Palette** | cream · coral · leaf · sun | near-black · phosphor green |
| **Wayfinder** | Rover mascot + sticker-shelf dock | DevDock (terminal-skinned) |
| **Tone** | "the human · shipped work · the arsenal" | `$ whoami · ~/work · stack.json` |

Both surfaces follow the exact same section flow — about → hero/marquee → work → technologies → laws/beliefs → certificates → connect → footer — and share one state layer (Zustand), so they can never drift apart.

- **Toggle**: the ∞ dock tile, in either universe
- **Deep links**: `#dev` / `#student` hash links boot the site straight into a universe (shareable)
- **Persistence**: your last universe is remembered across visits
- **Reduced motion**: the fold collapses to a calm crossfade

## Features

- **Flippable portrait card** — a real photograph on one face, the in-house "resident infinity" doodle on the other; springy side-hinge flip in student mode, top-hinge CRT-glitch swap in dev mode. Keyboard accessible.
- **Work case studies** — [Lemniscate ∞](https://github.com/Pushyanth02/Lemniscate) (local-first AI reading room), [Archmage](https://pushyanth02.github.io/Archmage/) (AI-powered creative suite), and [Dungeoncore Necromancer](https://pushyanth02.github.io/Dungeoncore-Necromancer/) (serialized novel & narrative engine), each with live demo + source links.
- **Resume modal** — PDF view and a clean-text view side by side, with download. Code-split: the chunk loads on first open.
- **Certificates with Hover Image Reveal** — hover (or tap, on any device) a certificate row and the whole certificate floats out, fitted edge-to-edge; the dev terminal keeps its `ls ~/certs` PDF links.
- **Contact form → prefilled Gmail compose** — a validated form that hands off to a prefilled Gmail draft addressed to [pushyanth2008@gmail.com](mailto:pushyanth2008@gmail.com).
- **Live IST clock** in the footer, calibrated to Bangalore (UTC+5:30).
- **Interactive Prism Grid background** — a tilted field of prismatic cells that light under your pointer (or during touch drags), alive in both universes with per-mode palettes.
- **Lightswind docks** — macOS-style magnifying dock on desktop, 44px static tap targets on touch, keyboard navigation with focus tooltips, and a visual-viewport lift so the dock never hides behind collapsing mobile URL bars.
- **Content protection notice** — a client-side deterrence banner for copycats and an intentional DevTools greeting.
- **Accessibility** — full `prefers-reduced-motion` compliance, semantic HTML, focus-visible rings, and a `noscript` fallback that keeps all reveals visible.

## Tech stack

| Layer | Tools |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, static export) |
| **UI runtime** | [React 19](https://react.dev) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) (strict) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) (CSS-first) + hand-written CSS (`globals` / `student` / `dev` / `fold`) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs) — mode, fold orchestration, dialogs |
| **Motion** | [Motion](https://motion.dev) (framer-motion) + CSS keyframes |
| **Visual components** | [Originkit](https://originkit.com) — Prism Grid, Hover Image Reveal, Liquid Grid, DotMatrix (WebGL), SVG Particles, Glass Icon, Text Morph |
| **Navigation** | [Lightswind](https://lightswind.com) Dock + `use-visual-lift` viewport hook |
| **UX chrome** | [shadcn/ui](https://ui.shadcn.com) patterns, [sonner](https://sonner.emilkowal.ski) toasts, [Lucide](https://lucide.dev) icons |
| **Typography** | Fraunces · Epilogue · Space Mono (via `next/font`) |

## Project structure

```
.
├── .github/
│   ├── workflows/deploy.yml        # GitHub Pages build & deploy (Bun + static export)
│   └── PULL_REQUEST_TEMPLATE.md    # PR checklist (mode parity, lint, mobile, a11y)
├── .vscode/                        # shared editor settings + recommended extensions
├── public/
│   ├── .nojekyll                   # tell GitHub Pages to skip Jekyll processing
│   ├── art/                        # illustrations & project art (WebP)
│   │   └── certs/                  # certificate images + original PDFs
│   ├── Pushyanth_Reddy_Resume.pdf  # resume for the modal & download
│   └── favicon.svg · icons · site.webmanifest · robots.txt
├── src/
│   ├── app/
│   │   ├── page.tsx                # the single page — both universes + fold state
│   │   ├── layout.tsx              # fonts, metadata, JSON-LD, toaster
│   │   ├── globals.css             # design tokens + base styles
│   │   ├── student.css             # student-universe sticker-notebook skin
│   │   ├── dev.css                 # dev-universe terminal skin
│   │   ├── fold.css                # the Infinity Fold transition
│   ├── components/
│   │   ├── site/                   # student universe: about, work, tech, beliefs,
│   │   │                           # certificates, connect, docks, resume modal, …
│   │   ├── dev/                    # dev universe: terminal windows per section
│   │   ├── originkit/              # Prism Grid, Hover Image Reveal, Liquid Grid,
│   │   │                           # DotMatrix, SVG Particles, Glass Icon, Text Morph
│   │   ├── lightswind/             # magnifying Dock + visual-viewport lift hook
│   │   └── ui/                     # shadcn/ui-style sonner toaster
│   └── lib/                        # zustand store, mode routing, tech data, utils
├── LICENSE                         # MIT
├── next.config.ts                  # static export + basePath wiring
├── package.json
├── tsconfig.json
└── README.md
```

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org) ≥ 20 and [Bun](https://bun.sh) ≥ 1.1 (or your favorite npm-compatible runner).

```bash
git clone https://github.com/Pushyanth02/Portfolio.git
cd Portfolio
bun install
bun run dev        # → http://localhost:3000
```

Other scripts:

| Command | What it does |
| :--- | :--- |
| `bun run lint` | ESLint over the whole project |
| `bun run build` | Static export → self-contained site in `out/` |
| `bun run start` | Preview the export locally (`npx serve out`) |

Building for a sub-path (e.g. a project page)? `next.config.ts` reads `NEXT_PUBLIC_BASE_PATH`:

```bash
NEXT_PUBLIC_BASE_PATH=/Portfolio bun run build
```

`next dev` ignores the export settings — local development is unaffected either way.

## Deployment (GitHub Pages)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): it installs dependencies with Bun, computes `NEXT_PUBLIC_BASE_PATH` from the repository name (empty for `owner.github.io` sites, `/<repo>` for project sites), runs the static build, and deploys `out/` through the official Pages actions. `public/.nojekyll` is included so Pages serves the export verbatim, with no Jekyll pass.

**One-time setup** (per repository):

1. Push the repo to GitHub (default branch `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Done — every push to `main` (or a manual *Run workflow*) redeploys the site.

### Custom domain (optional)

Add a `CNAME` file with your domain to `public/`, point your DNS at GitHub Pages ([GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)), then enforce HTTPS in **Settings → Pages**. Since a custom domain serves the site from the root, build with an empty `NEXT_PUBLIC_BASE_PATH`.

## Credits

- **[Originkit](https://originkit.com)** — the visual component library behind the magic: Prism Grid (page background), Hover Image Reveal (certificates), Liquid Grid, DotMatrix, SVG Particles, Glass Icon, and Text Morph.
- **[Lightswind](https://lightswind.com)** — the magnifying Dock pattern, hardened here with a visual-viewport lift hook for mobile browsers.
- **[shadcn/ui](https://ui.shadcn.com)** — dialog/toast primitives and component conventions.

## License

Released under the [MIT License](LICENSE) — the code is yours to learn from and build on. The personal content (portrait, artwork, resume, copy) remains Pushyanth's own; please don't rehost it as a portfolio of yours.

## Author

**Vulavala Pushyanth Reddy** — full-stack developer, CS undergrad, Bangalore, India.

- GitHub — [Pushyanth02](https://github.com/Pushyanth02)
- LinkedIn — [pushyanth-reddy](https://www.linkedin.com/in/pushyanth-reddy)
- Email — [pushyanth2008@gmail.com](mailto:pushyanth2008@gmail.com)

<div align="center">

<sub>∞ — fold responsibly.</sub>

</div>
