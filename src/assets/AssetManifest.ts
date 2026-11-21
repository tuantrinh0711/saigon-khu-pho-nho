export type AssetKind = 'gltf' | 'texture' | 'audio';

export interface AssetDefinition {
  readonly id: string;
  readonly kind: AssetKind;
  readonly url: string;
}

/** Add approved game assets here; keep the bootstrap scene asset-free. */
export const assetManifest: readonly AssetDefinition[] = [];
