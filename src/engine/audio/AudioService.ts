export type SoundId = string;

/** Keep audio calls independent from game rules and the audio backend. */
export interface AudioService {
  playEffect(id: SoundId): void;
  setMuted(muted: boolean): void;
  dispose(): void;
}
