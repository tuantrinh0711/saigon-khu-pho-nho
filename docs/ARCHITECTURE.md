# Architecture

## Current scope

This is a browser-based Three.js + TypeScript foundation using Vite and npm. No new game requirements have been supplied yet, so the only rendered content is a temporary rotating cube and grid. There is no player, enemy, world, physics simulation, backend, or game-specific UI.

## Layers and dependency direction

```text
main.ts -> game -> engine
                  assets
                  ui -> localization
                  networking -> shared
```

- **Engine (`src/engine`)** owns renderer creation, the frame loop, scene lifecycle, raw input, and presentation adapters. It does not decide game rules.
- **Game (`src/game`)** owns game states, entities, worlds, and rules after the new game design is approved. Game code may depend on engine contracts; engine code must not import game modules.
- **Assets (`src/assets`)** owns asset IDs, manifests, asynchronous loading, and runtime disposal. Gameplay asks for logical asset IDs rather than constructing file URLs in systems.
- **Networking (`src/networking`)** contains optional client interfaces only. No network service or backend is active.
- **Shared (`src/shared`)** holds language-independent schemas safe to share between clients and servers.
- **UI (`src/ui`)** presents state; it must not become the authority for game rules. Player text is resolved through stable localization keys.
- **Tests (`tests`)** separates fast unit tests from browser smoke tests. Add network protocol tests only if an online design is approved.

## Frame and state ownership

`GameLoop` receives frame timestamps from Three.js `setAnimationLoop`, clamps unusually large frame deltas, updates the active scene, and renders once. Simulation, collision, and game state must update before presentation animation. The rendering adapter owns the canvas and resizing; game rules never read renderer internals.

`GameStateMachine` provides explicit state entry, update, exit, and allowed transitions. The approved game design must define the actual states and transition table; the bootstrap does not invent them.

## Movement, animation, and collision audit

The new game requirements are pending. Do not assume characters, vehicles, combat, jumping, hitboxes, or physics. Once the mechanics are approved, update `GAME_LOOP.md` and record for each required movement/action:

- Gameplay state and collision representation, independent of visual meshes.
- Authored clip, skeleton/morph, animation state machine, procedural motion, IK, or physics presentation needed.
- Who owns the state transition and how animation events trigger audio or visual effects without deciding game rules.
- Required collision layers, triggers, blocking shapes, moving objects, and frame-rate/tunneling tests.

Do not add a physics package until the approved movement and collision needs justify one.

## Renderer and compatibility

The initial renderer is `WebGLRenderer`, isolated behind `RendererFactory`. Before selecting WebGPU or adding custom shaders/post-processing, audit the pinned Three.js release and target-browser support. Keep capability handling and any backend choice in the rendering layer.

| Capability | Initial behavior | Follow-up |
|---|---|---|
| WebGL2 renderer | Required by the current bootstrap | Verify supported browser/device matrix from new requirements |
| Resize and DPR | Window resize, DPR capped at 2 | Profile representative screens and hardware |
| Context loss | Browser may lose the render context | Add readable pause/recovery flow before shipping a game |
| Quality tiers | None | Define from measured frame time and target devices |

## UI and localization

The bootstrap contains only an accessible status message. A future game UI should define menus/HUD/loading/settings based on the approved loop. Give each UI feature one responsibility; keep the state model outside DOM presentation. Player-facing strings live in `src/localization/locales/` and use stable keys from `src/localization/text.ts`.

## Online boundaries

The default architecture is offline. Add no accounts, persistence, multiplayer, economy, or server-authoritative rules until the new requirements call for them. If online play is approved, the server owns trusted state and authorization; the browser receives only public client configuration. Protocol IDs remain language-independent.
