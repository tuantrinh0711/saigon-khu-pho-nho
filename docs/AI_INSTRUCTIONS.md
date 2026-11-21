# AI Instructions

## Before changing code

- Read `README.md`, `ARCHITECTURE.md`, `GAME_LOOP.md`, and relevant feature docs.
- The old game concept is retired. Do not restore its characters, delivery loop, neighborhood, missions, assets, or name without a new approved requirement.
- Ask for or use the approved new requirements before implementing game-specific mechanics. The bootstrap cube is temporary.

## File ownership and dependencies

- `src/engine/`: reusable timing, rendering, input, scene lifecycle, animation/audio adapters, and diagnostics. Never import `src/game/` here.
- `src/game/`: game-specific states, entities, rules, and worlds; may depend on engine interfaces.
- `src/assets/`: manifest, asynchronous loaders, cache, and disposal.
- `src/networking/`: optional client transport; no backend is currently active.
- `src/shared/`: stable, language-independent protocol/data contracts safe to share.
- `src/ui/`: presentation only; never authority for game rules.
- `src/localization/`: player-visible text and stable locale keys.
- `tests/unit/`, `tests/browser/`: unit tests and real-browser tests respectively.

Use PascalCase for classes/types/files that export a class, camelCase for functions/variables, and stable lower-case dotted IDs for player-facing text and network messages. Avoid giant files, hidden global state, direct `fetch()` calls inside game rules, and hard-coded player-facing strings.

## Movement, collision, and animation

Audit the approved mechanics first. Keep collision bodies and gameplay state independent of visual meshes. Update game state/collision before animation and rendering. Animation may request presentation events; gameplay code validates and owns the resulting action. Do not add combat, physics, vehicles, or other mechanics unless the design requires them.

## Validation and docs

Use npm scripts in `package.json`; do not replace the package manager or add a dependency without documenting why. Run typecheck, unit tests, browser tests, and production build after dependencies and Playwright Chromium are installed. Update existing docs rather than creating a competing source of truth. Report exactly which checks ran and their results; do not claim tests or measurements that were not verified.
