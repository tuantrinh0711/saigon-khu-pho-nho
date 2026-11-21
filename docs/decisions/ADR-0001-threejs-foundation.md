# ADR-0001: Three.js browser foundation

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

The previous prototype is being retired and the new game's requirements have not yet been provided. We need a modular web-game foundation that can grow without choosing game-specific physics, networking, or presentation systems prematurely.

## Decisions

- Use Three.js 0.187.0 with TypeScript 7.0.2 and Vite 8.3.8; pin versions in `package.json` for reproducible setup.
- Use npm as package manager because no competing lockfile/package manager exists in the repository.
- Keep a conventional `WebGLRenderer` behind `RendererFactory` until supported browsers and visual requirements justify another renderer path.
- Start offline with no server, persistence, physics library, or gameplay-specific systems.
- Use Vitest for fast state/rule unit tests and Playwright for browser smoke tests.

## Consequences

- Vite 8 requires Node 20.19+ or 22.12+; this workspace has Node 24, but npm is currently unavailable in the shell, so dependencies and a lockfile still need to be installed/generated in a normal Node.js environment.
- Renderer and physics choices must be re-evaluated after the new game requirements and target devices are known.
- Git history retains the old prototype; its runtime code and assets are removed from the current working tree.
