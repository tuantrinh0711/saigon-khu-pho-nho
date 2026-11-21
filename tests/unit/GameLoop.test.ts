import { describe, expect, it, vi } from 'vitest';
import { GameLoop, type AnimationLoopDriver } from '../../src/engine/GameLoop';

class FakeDriver implements AnimationLoopDriver {
  callback: ((time: number) => void) | null = null;

  setAnimationLoop(callback: ((time: number) => void) | null): void {
    this.callback = callback;
  }
}

describe('GameLoop', () => {
  it('updates before rendering and clamps long frame gaps', () => {
    const driver = new FakeDriver();
    const update = vi.fn<(deltaSeconds: number) => void>();
    const render = vi.fn<() => void>();
    const loop = new GameLoop(driver, update, render);
    loop.start();

    driver.callback?.(1000);
    driver.callback?.(1016);
    driver.callback?.(1500);

    expect(update.mock.calls.map(([delta]) => delta)).toEqual([0, 0.016, 0.1]);
    expect(render).toHaveBeenCalledTimes(3);
    expect(update.mock.invocationCallOrder[0]).toBeLessThan(render.mock.invocationCallOrder[0]);
  });

  it('stops requesting frames when stopped', () => {
    const driver = new FakeDriver();
    const render = vi.fn<() => void>();
    const loop = new GameLoop(driver, vi.fn(), render);
    loop.start();
    const previousCallback = driver.callback;
    loop.stop();
    previousCallback?.(1000);

    expect(driver.callback).toBeNull();
    expect(render).not.toHaveBeenCalled();
  });
});
