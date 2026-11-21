import { Scene } from 'three';

export interface SceneModule {
  readonly scene: Scene;
  update(deltaSeconds: number): void;
  dispose(): void;
}

export class SceneManager {
  private current: SceneModule | null = null;

  setCurrent(next: SceneModule): void {
    this.current?.dispose();
    this.current = next;
  }

  getCurrent(): SceneModule {
    if (!this.current) throw new Error('No game scene has been installed.');
    return this.current;
  }

  update(deltaSeconds: number): void {
    this.current?.update(deltaSeconds);
  }

  dispose(): void {
    this.current?.dispose();
    this.current = null;
  }
}
