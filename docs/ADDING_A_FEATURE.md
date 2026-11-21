# Adding a Feature

1. Confirm the feature supports the approved game loop in `GAME_LOOP.md`.
2. Inspect existing modules and update architecture/decision docs before adding a new dependency or boundary.
3. Put game rules under `src/game/`, reusable browser/Three.js services under `src/engine/`, asset loading under `src/assets/`, presentation under `src/ui/`, and stable shared contracts under `src/shared/`.
4. Keep gameplay state authoritative in game systems; renderer, animation, audio, and UI present that state.
5. Add localization keys for every new player-facing string.
6. Add focused unit tests for rules and state transitions. Add integration/protocol/browser coverage for cross-layer or user-visible behavior.
7. Run `npm run typecheck`, `npm run test`, and `npm run build` after installing dependencies and required browser binaries.
8. Update relevant docs with ownership, lifecycle, commands, changed assets, test evidence, and known limitations.

Avoid a monolithic `Game`, renderer, scene, UI, or global manager. Prefer small interfaces with clear ownership and deterministic disposal.
