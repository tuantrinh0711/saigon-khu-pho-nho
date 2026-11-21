/** Network IDs are stable and language-independent; add messages after online scope is approved. */
export interface NetworkEnvelope<TType extends string = string, TPayload = unknown> {
  readonly type: TType;
  readonly requestId: string;
  readonly payload: TPayload;
}
