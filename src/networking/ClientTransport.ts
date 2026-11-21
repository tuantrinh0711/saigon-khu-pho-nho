import type { ConnectionState } from './ConnectionState';

/** Optional interface only. No server connection is created by the foundation. */
export interface ClientTransport {
  getState(): ConnectionState;
  connect(): Promise<void>;
  send(message: unknown): void;
  disconnect(): void;
}
