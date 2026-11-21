# Asset Pipeline

## Current state

No game-specific assets are installed. `src/assets/AssetManifest.ts` is the registry for approved logical asset IDs. `AssetLoader` provides asynchronous GLTF, texture, and audio loading through Three.js loaders. The bootstrap scene uses code-created geometry only.

## Adding an asset

1. Approve the asset's role, license/source, target visual quality, and intended device range.
2. Store source files separately from optimized game exports when a source workflow exists.
3. Export glTF/GLB for models, with named objects/materials and animation clips where needed. Use texture formats and compression only after target-browser compatibility is checked.
4. Add an asset definition with a stable ID and public path to the manifest.
5. Load asynchronously through the asset layer, show a player-readable loading/failure state where the asset blocks play, and provide a safe fallback where possible.
6. Dispose geometries, materials, textures, audio buffers, and object URLs when their owning scene or cache entry is released.
7. Verify appearance, animation, memory, download size, and loading behavior on target devices.

Do not commit secrets or depend on private file URLs. Document attribution and licenses alongside each externally sourced asset.
