import { WebGLRenderer } from 'three';

export function createRenderer(host: HTMLElement): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight);
  renderer.domElement.setAttribute('aria-label', '3D game scene');
  renderer.domElement.setAttribute('role', 'img');
  host.append(renderer.domElement);
  return renderer;
}
