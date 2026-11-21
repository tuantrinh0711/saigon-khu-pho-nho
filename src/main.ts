import { GameApp } from './game/GameApp';
import { text } from './localization/text';
import { GameStatus } from './ui/GameStatus';

const host = document.querySelector<HTMLElement>('#game-canvas');
const statusElement = document.querySelector<HTMLElement>('#game-status');

if (!host || !statusElement) {
  throw new Error('Required game bootstrap elements are missing.');
}

const status = new GameStatus(statusElement);

try {
  const game = new GameApp(host);
  game.start();
  status.show('game.ready');
  window.addEventListener('pagehide', () => game.dispose(), { once: true });
} catch (error) {
  console.error('Game bootstrap failed.', error);
  status.show('game.startError');
}
