export interface AnimationLoopDriver {
  setAnimationLoop(callback: ((time: number) => void) | null): void;
}

export class GameLoop {
  private previousTime: number | null = null;
  private running = false;

  constructor(
    private readonly driver: AnimationLoopDriver,
    private readonly update: (deltaSeconds: number) => void,
    private readonly render: () => void,
    private readonly maxDeltaSeconds = 0.1,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.previousTime = null;
    this.driver.setAnimationLoop(this.onFrame);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.previousTime = null;
    this.driver.setAnimationLoop(null);
  }

  private readonly onFrame = (timeMilliseconds: number): void => {
    if (!this.running) return;

    const deltaMilliseconds = this.previousTime === null
      ? 0
      : Math.max(0, timeMilliseconds - this.previousTime);
    this.previousTime = timeMilliseconds;
    this.update(Math.min(deltaMilliseconds / 1000, this.maxDeltaSeconds));
    this.render();
  };
}
