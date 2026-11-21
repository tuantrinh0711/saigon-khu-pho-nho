import { AudioLoader, Mesh, Object3D, TextureLoader, type Material, type Texture } from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
  private readonly modelLoader = new GLTFLoader();
  private readonly textureLoader = new TextureLoader();
  private readonly audioLoader = new AudioLoader();

  loadModel(url: string): Promise<GLTF> {
    return this.modelLoader.loadAsync(url);
  }

  loadTexture(url: string): Promise<Texture> {
    return this.textureLoader.loadAsync(url);
  }

  loadAudio(url: string): Promise<AudioBuffer> {
    return this.audioLoader.loadAsync(url);
  }

  disposeModel(root: Object3D): void {
    const textures = new Set<Texture>();
    root.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material: Material) => {
        Object.values(material).forEach((value) => {
          if (value instanceof Texture) textures.add(value);
        });
        material.dispose();
      });
    });
    textures.forEach((texture) => texture.dispose());
  }
}
