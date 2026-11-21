import { PerspectiveCamera, WebGLRenderer } from 'three';
import { GameLoop } from '../engine/GameLoop';
import { createRenderer } from '../engine/rendering/RendererFactory';
import { SceneManager } from '../engine/scene/SceneManager';
import { BootstrapScene } from './world/BootstrapScene';

export class GameApp {
  private readonly renderer: WebGLRenderer;
  private readonly camera = new PerspectiveCamera(55, 1, 0.1, 100);
  private readonly scenes = new SceneManager();
  private readonly loop: GameLoop;

  constructor(private readonly host: HTMLElement) {
    this.renderer = createRenderer(host);
    this.scenes.setCurrent(new BootstrapScene(this.camera));
    this.loop = new GameLoop(
      this.renderer,
      (deltaSeconds) => this.scenes.update(deltaSeconds),
      () => this.renderer.render(this.scenes.getCurrent().scene, this.camera),
    );
    window.addEventListener('resize', this.resize);
  }

  start(): void {
    this.resize();
    this.loop.start();
  }

  dispose(): void {
    this.loop.stop();
    this.scenes.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    window.removeEventListener('resize', this.resize);
  }

  private readonly resize = (): void => {
    const width = Math.max(1, this.host.clientWidth || window.innerWidth);
    const height = Math.max(1, this.host.clientHeight || window.innerHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  };
}
