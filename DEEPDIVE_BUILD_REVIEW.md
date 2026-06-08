# DeepDive Build Review and Corrective Prompt

## Verdict

The current build is a useful first scaffold, but it does not yet satisfy the original Antigravity prompt.

It has a Next.js 16 App Router project, the requested major dependencies, a landing page, one dynamic lesson route, one Lesson 12 MDX file, and initial versions of the four Sprint 1 visualization components. However, the implementation is still closer to a prototype than a Distill.pub-quality animated learning site.

## Verification Performed

- `npm run lint`: fails.
- `npm run build`: passes only after allowing network access for `next/font` to fetch Google Fonts.
- `curl http://localhost:3000`: home route responds.
- `curl http://localhost:3000/lessons/12-gradient-descent`: lesson route responds and renders MDX, KaTeX, controls, and a Three.js canvas.

The `agent-browser` CLI referenced by the local Vercel verification skill was not available in this environment, so browser verification was limited to localhost HTTP output and the existing Next dev logs.

## Build and Quality Issues

1. Lint fails on `src/components/viz/LossSurface3D.tsx` because it calls `setResetKey` synchronously inside an effect. There are also warnings for unused variables/imports and a missing hook dependency.
2. Production build depends on live Google Font fetching through `next/font/google`. This fails in restricted/offline environments. Consider self-hosted fonts or a documented network requirement.
3. The dev log contains repeated Three.js warnings such as deprecated `PCFSoftShadowMap` and `Clock`, plus WebGL context lost messages. This needs cleanup before calling the animation layer stable.

## Prompt Compliance

### What Is Present

- Next.js 16 App Router, TypeScript, Tailwind, MDX-related packages, Framer Motion, D3, Three/R3F/drei, KaTeX, Zustand, and Shiki are installed.
- `src/app/page.tsx` links to `/lessons/12-gradient-descent`.
- `src/app/lessons/[slug]/page.tsx` renders MDX from `content/lessons`.
- Initial components exist for `NeuralNet`, `LossSurface3D`, `MatrixViz`, `TrainingChart`, `Slider`, `Toggle`, and `PlayControl`.
- `content/lessons/12-gradient-descent.mdx` exists and includes KaTeX math plus an interactive descent component.

### What Is Missing or Too Thin

- No `/curriculum` route.
- No `/playground` route.
- Lesson MDX has no required frontmatter: title, difficulty, prereqs, estimated time.
- Lesson layout is not the requested single-column prose with full-bleed interactive sections.
- The landing page is static and generic. It does not include the requested animated hero showing a small net training itself or a curriculum overview.
- `NeuralNet` only draws a static animated network. It does not support arbitrary MLP state, forward pass, backward pass, weights, activations, or hover details.
- `LossSurface3D` only supports one convex bowl and two optimizer modes. It has no scrubber, trajectory, gradient arrows, loss readout, step counter, surface selector, convergence/divergence explanation, or accessible fallback.
- `MatrixViz` is a heatmap only. It does not animate between states or support the matrix transformation lesson use case.
- `TrainingChart` renders a chart but is not connected to a live training or descent process.
- `Slider` is custom pointer-only UI with no native range input semantics, which hurts keyboard and screen-reader accessibility.
- `Toggle` uses a `div` with switch role inside a label, but lacks native button/input keyboard behavior.
- Animations do not consistently respect `prefers-reduced-motion`.
- The original non-negotiable says animations must always be controllable with play, pause, and scrub. The current lesson has play/pause but no scrub.
- The prompt asks to "make Lesson 12 perfect" before continuing. The current lesson is explanatory but not yet reference-quality.

## Recommended Next Step

Do not continue to Sprint 2 yet. Use the corrective prompt below to repair Sprint 1 and make Lesson 12 a true reference lesson.

## Corrective Prompt

Copy the prompt below into Antigravity or another builder.

```text
You are taking over an incomplete Next.js deep-learning learning site called DeepDive.

Before editing code:
- Read AGENTS.md.
- This repo uses Next.js 16, not the older Next.js API assumptions. Read the relevant local docs in node_modules/next/dist/docs before changing App Router, MDX, routing, fonts, or build behavior.
- Inspect the existing files and preserve useful work. Do not delete and restart the project.

Goal:
Repair Sprint 1 so the site satisfies the original DeepDive prompt at a reference-lesson quality bar. Stop after Sprint 1 is complete.

Current target:
Make /lessons/12-gradient-descent a polished, interactive, accessible, animated reference lesson for gradient descent. The lesson should teach by manipulation, not by static explanation.

Required routes:
- /: animated hero with DeepDive as the first-viewport signal, a small neural net or optimizer animation, and a compact curriculum overview.
- /curriculum: module and lesson tree scaffold showing the 54-lesson roadmap.
- /lessons/12-gradient-descent: complete reference lesson.
- /playground: simple sandbox that reuses the Sprint 1 controls/components.

Required Sprint 1 components:
- NeuralNet: render arbitrary MLP layer sizes, show activations, animate forward pass, animate backward gradients, and expose useful props for lesson state.
- LossSurface3D: lazy-load the Three.js scene, show a loss surface, optimizer ball, gradient vector, trajectory trail, current coordinates, loss value, step count, and optimizer mode. Include convex bowl, saddle, ravine, and Rosenbrock surfaces.
- MatrixViz: heatmap with hover values and animated transitions between matrices.
- TrainingChart: live-updating D3 loss/accuracy chart that can be driven by optimizer state.
- Slider, Toggle, PlayControl: accessible primitives with keyboard support, visible focus, ARIA labels, and consistent visual design.

Lesson 12 requirements:
- Use MDX frontmatter: title, difficulty, prereqs, estimated time.
- Explain gradient descent with KaTeX equations.
- Include a full-bleed interactive optimizer lab.
- The lab must have play, pause, reset, and scrub controls. No uncontrollable autoplay loops.
- Controls must include learning rate, momentum, optimizer mode, and surface type.
- Show too-small learning rate, healthy learning rate, and too-large learning rate behavior clearly.
- Add a trajectory trail, live loss chart, and small readout panel for x, y, loss, gradient norm, step count, optimizer, and convergence/divergence status.
- Include a reduced-motion mode or static fallback that still communicates the current state.
- Make mobile readable. The 3D view can simplify on small screens, but controls and explanation must remain usable.

Design requirements:
- Dark mode default with neutral chrome.
- Electric blue/violet for active UI.
- Amber for loss/gradient semantics.
- Cyan for activation/forward-pass semantics.
- Red only for error/loss spikes/divergence.
- Avoid generic template feel. This should feel like a serious interactive textbook, not a marketing landing page.
- Do not nest UI cards inside other cards.
- Use full-bleed bands or unframed layouts for sections. Cards are only for repeated items or tool panels.

Accessibility and performance:
- All controls keyboard accessible.
- Canvas has an accessible textual state summary nearby.
- Respect prefers-reduced-motion.
- Lazy-load Three.js/R3F heavy code so the home page does not eagerly ship it.
- Avoid repeated Three.js deprecation warnings and WebGL context lost messages in normal use.

Build requirements:
- npm run lint must pass with zero errors.
- npm run build must pass.
- If next/font/google causes network-sensitive builds, switch to self-hosted or local font handling.
- Verify /, /curriculum, /playground, and /lessons/12-gradient-descent locally.

Deliverable:
- Commit-ready code changes only.
- Do not implement lessons 1-11 or 13-54 yet.
- At the end, report exactly what changed, which commands passed, and any remaining limitations.
```

