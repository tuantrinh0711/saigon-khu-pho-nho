import { text, type TextKey } from '../localization/text';

export class GameStatus {
  constructor(private readonly element: HTMLElement) {}

  show(key: TextKey): void {
    this.element.textContent = text(key);
  }
}
