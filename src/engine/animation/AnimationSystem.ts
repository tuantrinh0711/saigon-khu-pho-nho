/** A game-facing animation adapter updated by the central game loop. */
export interface AnimationSystem {
  update(deltaSeconds: number): void;
  dispose(): void;
}
