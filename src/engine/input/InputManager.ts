export class InputManager {
  private readonly pressedCodes = new Set<string>();

  constructor(private readonly target: Window = window) {
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('blur', this.clear);
  }

  isPressed(code: string): boolean {
    return this.pressedCodes.has(code);
  }

  dispose(): void {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('blur', this.clear);
    this.clear();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!event.repeat) this.pressedCodes.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressedCodes.delete(event.code);
  };

  private readonly clear = (): void => {
    this.pressedCodes.clear();
  };
}
