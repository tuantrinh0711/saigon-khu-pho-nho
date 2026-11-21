export interface GameState<Context> {
  enter(context: Context): void;
  update(context: Context, deltaSeconds: number): void;
  exit(context: Context): void;
}
