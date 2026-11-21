import { describe, expect, it, vi } from 'vitest';
import type { GameState } from '../../src/game/state/GameState';
import { GameStateMachine } from '../../src/game/state/GameStateMachine';

type StateId = 'menu' | 'play';
type Context = { score: number };

function makeState(): GameState<Context> {
  return { enter: vi.fn(), update: vi.fn(), exit: vi.fn() };
}

describe('GameStateMachine', () => {
  it('enters, transitions, updates, and exits states in order', () => {
    const menu = makeState();
    const play = makeState();
    const context = { score: 0 };
    const machine = new GameStateMachine<StateId, Context>(
      new Map<StateId, GameState<Context>>([['menu', menu], ['play', play]]),
      new Map<StateId, ReadonlySet<StateId>>([
        ['menu', new Set<StateId>(['play'])],
        ['play', new Set<StateId>()],
      ]),
      context,
    );

    machine.enter('menu');
    machine.transition('play');
    machine.update(0.016);
    machine.dispose();

    expect(menu.enter).toHaveBeenCalledWith(context);
    expect(menu.exit).toHaveBeenCalledWith(context);
    expect(play.enter).toHaveBeenCalledWith(context);
    expect(play.update).toHaveBeenCalledWith(context, 0.016);
    expect(play.exit).toHaveBeenCalledWith(context);
    expect(machine.current).toBeNull();
  });

  it('rejects transitions that are not in the transition map', () => {
    const machine = new GameStateMachine<StateId, Context>(
      new Map<StateId, GameState<Context>>([['menu', makeState()], ['play', makeState()]]),
      new Map<StateId, ReadonlySet<StateId>>([['menu', new Set<StateId>()]]),
      { score: 0 },
    );
    machine.enter('menu');

    expect(() => machine.transition('play')).toThrow('is not allowed');
  });
});
