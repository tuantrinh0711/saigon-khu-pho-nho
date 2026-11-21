# Three.js Game Foundation

A clean browser-game foundation built with Three.js, TypeScript, and Vite. The previous game implementation has been removed from the working tree. The new game requirements have not been defined yet, so this project contains only a minimal rotating-object scene and reusable architecture foundations.

## Requirements

- Node.js 22.12+ (or 20.19+)
- npm

## Start

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`.

## Project structure

- `src/engine/`: renderer, scene lifecycle, input, game loop, animation and audio boundaries.
- `src/game/`: game-state contracts and game-specific systems once requirements are approved.
- `src/assets/`: manifest and asynchronous asset loading.
- `src/networking/`: optional client transport contracts; no backend is enabled.
- `src/shared/`: language-independent shared contracts.
- `src/ui/`: player-facing status and future game screens.
- `src/localization/`: stable player-facing text keys and English fallback.
- `tests/`: unit and browser smoke tests.
- `docs/`: architecture, game-loop decisions, asset pipeline, networking, feature workflow, AI instructions, and the saved secure-backend prompt in `docs/prompts/`.

## Checks

```powershell
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

For browser tests, install Playwright's Chromium once with `npx playwright install chromium`.

## Status

This is Step 2 architecture work, not a finished game. The player fantasy, genre, mechanics, target platform details, and online requirements must be written in `docs/GAME_LOOP.md` before game-specific systems are added. See `docs/AI_INSTRUCTIONS.md` for implementation rules.
