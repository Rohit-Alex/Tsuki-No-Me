# React Mastery — Beginner to Staff Engineer

A deep-dive React course built for senior frontend interview preparation. Every topic is validated against the [official React documentation](https://react.dev) and covers **why** a feature exists, **how** it evolved, and **how it works internally** — not just the API surface.

> Companion to [Optimization.md](../Optimization.md).

## Per-topic structure

Each module follows the same shape: Introduction → Historical Context → Motivation → Mental Model → Internal Working → Step-by-Step Execution → Practical Examples → Diagrams → Edge Cases → Performance → Interview Questions (Basic/Intermediate/Senior/Staff) → Common Mistakes → Official Docs → Revision Notes → Practice Exercises.

## Modules

| # | Module | Status |
|---|---|---|
| 1 | [Why React Exists](./Module01-WhyReactExists.md) | ✅ Done |
| 1a | [Design Principles](./Module01a-DesignPrinciples.md) — deep dive: composition, common abstraction, escape hatches, scheduling | ✅ Done |
| 2 | [React Fundamentals](./Module02-ReactFundamentals.md) — createElement, JSX compilation, elements, reconciliation, keys, Root API, StrictMode | ✅ Done |
| 3 | [Fiber Architecture](./Module03-FiberArchitecture.md) — fiber nodes, double buffering, work loop, lanes, effect flags | ✅ Done |
| 4 | [Virtual DOM, Diffing & Reconciliation](./Module04-VirtualDOM-Diffing.md) — VDOM vs Real DOM, the two-pass list diff, full `setState` trace, app load | ✅ Done |
| 5 | [Component Model](./Module05-ComponentModel.md) — props, state, controlled inputs, composition, context, portals, classes | ✅ Done |
| 6 | [Hooks](./Module06-Hooks.md) — rules & why, every hook, stale closures, memo/useCallback, React 19 hooks | ✅ Done |
| 7 | [Rendering Patterns](./Module07-Rendering.md) — CSR, SSR, SSG/ISR, streaming, hydration, selective hydration, RSC, Islands, code splitting | ✅ Done |
| 8 | [State Management](./Module08-StateManagement.md) — state structure, the ladder, context limits, stores, server vs client state | ✅ Done |
| 9 | [Performance](./Module09-Performance.md) — memo measured, waterfalls, virtualization, bundle size, profiling | ✅ Done |
| 10 | [Patterns](./Module10-Patterns.md) — custom hooks, compound components, render props, HOCs, headless, controlled/uncontrolled | ✅ Done |
| 11 | [React 16 → 17 → 18 → 19](./Module11-VersionHistory.md) — what changed each version and why, through 19.2 | ✅ Done |
| 12 | [React Internals](./Module12-Internals.md) — scheduler & yielding, lanes, synthetic events, update queue, commit phases | ✅ Done |
| 13 | [Interview Preparation](./Module13-InterviewPrep.md) — output puzzles, debugging drills, machine coding, system design, 2-week plan | ✅ Done |
| 14 | [Build Tooling](./Module14-BuildTooling.md) — bundling pipeline, tree-shaking measured, code splitting, Vite vs webpack, source maps | ✅ Done |
| 14a | [The Build, End to End](./Module14a-BuildPipelineEndToEnd.md) — every stage of `npm run build`, env vars, vault secrets, chunks, hashing, caching | ✅ Done |

## Verification

Claims about runtime behavior are checked by running React rather than asserted from memory. The scripts live in [verify/](./verify/) with setup instructions — element shape, JSX compiler output, reconciliation rules, the index-key bug, and StrictMode behavior are all reproducible.

## Version baseline

Latest stable **React 19.2** (October 2025); React Compiler v1.0 (2025). Version-specific behavior is called out inline. Legacy and deprecated APIs are explicitly labeled.
