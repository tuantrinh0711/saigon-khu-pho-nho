# Game Loop and Requirements

## Status

**Pending new game requirements.** The previous game concept is no longer the active design. Do not add its delivery, neighborhood, vehicle, or relationship systems back into this project unless they are part of the new requirement.

## Decisions to record before game implementation

- Player fantasy and role.
- Genre, target audience, and emotional tone.
- Player goal and meaningful failure/recovery states.
- Sources of pressure and the defining twist.
- Core verbs and the moment-to-moment/session loops.
- Single-player or online play; any persistent/shared state.
- Target browsers/devices and input methods.
- Visual/audio direction and accessibility/localization needs.

Until these are approved, the app remains a renderer smoke scene. The rotating cube is temporary and is not a game mechanic.

## Movement, animation, and collision inventory

No movement category is approved yet. When requirements arrive, list required locomotion, traversal, interaction/action animation, facial animation, mechanical motion, VFX motion, secondary motion, IK, and physics-driven reactions individually. For each, choose authored animation, a state machine/blend, procedural presentation, physics, or a simple non-animated interaction as appropriate.

Specify gameplay collision separately from visual meshes. Record blockers, interaction triggers, moving platforms/props, hit detection if applicable, collision groups, fast-motion sweeps, and relevant tests. Do not add combat or a physics engine by default.

## First playable definition

To be written after the new requirements are approved. The first build should implement one complete, testable loop with success, failure/recovery, and player-readable feedback rather than a broad set of unfinished systems.
