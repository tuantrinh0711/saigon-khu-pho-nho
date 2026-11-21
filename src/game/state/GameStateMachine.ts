import type { GameState } from './GameState';

export class GameStateMachine<Id extends string, Context> {
  private currentId: Id | null = null;
  private currentState: GameState<Context> | null = null;

  constructor(
    private readonly states: ReadonlyMap<Id, GameState<Context>>,
    private readonly transitions: ReadonlyMap<Id, ReadonlySet<Id>>,
    private readonly context: Context,
  ) {}

  get current(): Id | null {
    return this.currentId;
  }

  enter(initialState: Id): void {
    if (this.currentId !== null) throw new Error('The state machine is already active.');
    this.setState(initialState);
  }

  transition(nextId: Id): void {
    if (this.currentId === null) throw new Error('Enter an initial state before transitioning.');
    if (!this.transitions.get(this.currentId)?.has(nextId)) {
      throw new Error(`Transition from ${this.currentId} to ${nextId} is not allowed.`);
    }
    this.setState(nextId);
  }

  update(deltaSeconds: number): void {
    this.currentState?.update(this.context, deltaSeconds);
  }

  dispose(): void {
    this.currentState?.exit(this.context);
    this.currentState = null;
    this.currentId = null;
  }

  private setState(id: Id): void {
    const next = this.states.get(id);
    if (!next) throw new Error(`Unknown game state: ${id}.`);
    this.currentState?.exit(this.context);
    this.currentId = id;
    this.currentState = next;
    next.enter(this.context);
  }
}
