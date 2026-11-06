# The Digital Workshop — Implementation Plan

## Assessment
The repository is an unmodified React 19 + Vite starter with Framer Motion, Lucide React, and React Router DOM already installed. There is no existing product structure to preserve beyond the Vite entrypoint and package scripts.

## Design direction
Three possible directions were considered: **Editorial studio notebook** (0.06), **Museum of unfinished machines** (0.04), and **Soft industrial workbench** (0.07). The selected direction is **Soft industrial workbench**.

- **Design movement:** art-directed editorial interface with workshop annotations, paper layers, ruled surfaces, and deliberate asymmetry.
- **Core principles:** make exploration feel physical, keep navigation legible, use contrast instead of decorative gradients, and let every interaction explain itself.
- **Color philosophy:** Workshop Ink provides a calm, ink-on-paper foundation; Apricot marks active human moments; Electric Blue and Soft Green separate discovery from proof; Lavender is reserved for reflective decisions.
- **Layout paradigm:** a persistent left-hand rail and a broad work surface where each “room” is a distinct composition rather than a repeated card grid.
- **Signature elements:** registration marks, paper tabs, and the amber “work in progress” ticker.
- **Interaction philosophy:** clicking a room feels like pulling a drawer open; decisions reveal trade-offs instead of scoring the visitor.
- **Animation:** springy room transitions, staggered entrances, gentle instrument movement, and reduced-motion fallbacks.
- **Typography system:** Space Grotesk for headings, Inter for readable copy, IBM Plex Mono for labels, metadata, and route breadcrumbs.
- **Brand essence:** a thoughtful digital workbench for people who care how ideas become systems; curious, tactile, precise.
- **Brand voice:** direct, warm, and process-aware. Example lines: “Ideas enter. Experiments happen. Things get built.” / “Open a drawer. See the trade-off.”
- **Wordmark & logo:** a monogram-like “DW” registration mark built from two offset brackets and a small orange pin.
- **Signature brand color:** Apricot (#F3A66B), used as the human signal in an otherwise quiet system.

## Implementation
- Use `BrowserRouter` with seven direct routes and a catch-all redirect to `/`.
- Keep section content in data objects so editable placeholders are obvious and content can be replaced without changing layout code.
- Build a persistent `WorkshopShell` with desktop rail, mobile menu, location breadcrumb, and a home shortcut.
- Use Framer Motion for route transitions, section entrances, project hover states, and Decision Bench feedback, with `useReducedMotion` handling.
- Build Decision Bench as a local state machine with three scenarios, choice-specific trade-offs, progress, restart, alternative exploration, and a follow-up step for the architecture scenario.
- Add `public/manus-routes.json` for route discovery and SPA deployment readiness.
- Keep all project claims explicitly marked `[Editable placeholder]` because no project facts were verified in the source brief.

## Project structure
- `src/App.jsx`: routing, shared shell, section views, Decision Bench state.
- `src/App.css`: component layout, responsive compositions, workshop motifs, animation details.
- `src/index.css`: global reset, palette, typography, reduced-motion behavior.
- `public/manus-routes.json`: declared page routes for deployment tooling.
- `plan.md` / `TODO.md`: implementation record and acceptance outcomes.
