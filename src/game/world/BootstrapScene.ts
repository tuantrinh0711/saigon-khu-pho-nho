import {
  BoxGeometry,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  LineSegments,
  Mesh,
  Material,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
} from 'three';
import type { SceneModule } from '../../engine/scene/SceneManager';

/** Temporary renderer smoke scene; replace it after the new game requirements are defined. */
export class BootstrapScene implements SceneModule {
  readonly scene = new Scene();
  private readonly cube: Mesh<BoxGeometry, MeshStandardMaterial>;

  constructor(camera: PerspectiveCamera) {
    this.scene.background = new Color('#111923');
    camera.position.set(3.8, 3.2, 5.2);
    camera.lookAt(0, 0.6, 0);

    this.scene.add(new HemisphereLight('#d9e9ff', '#27313a', 2.1));
    const keyLight = new DirectionalLight('#fff1d4', 2.6);
    keyLight.position.set(4, 6, 3);
    this.scene.add(keyLight);

    const floor = new GridHelper(12, 12, '#607184', '#293746');
    floor.position.y = -0.02;
    this.scene.add(floor);

    this.cube = new Mesh(
      new BoxGeometry(1.2, 1.2, 1.2),
      new MeshStandardMaterial({ color: '#e9a85b', roughness: 0.52 }),
    );
    this.cube.position.y = 0.62;
    this.scene.add(this.cube);
  }

  update(deltaSeconds: number): void {
    this.cube.rotation.y += deltaSeconds * 0.55;
    this.cube.rotation.x += deltaSeconds * 0.18;
  }

  dispose(): void {
    this.scene.traverse((object) => {
      if (!(object instanceof Mesh) && !(object instanceof LineSegments)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material: Material) => material.dispose());
    });
    this.scene.clear();
  }
}
