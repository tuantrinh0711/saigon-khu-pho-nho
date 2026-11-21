# Networking

## Current decision

No new game requirements have been supplied, so this foundation is offline and has no backend. `src/networking/ClientTransport.ts` and `src/shared/network/Protocol.ts` define only future boundaries; there is no active transport, authentication, server, or persistence.

## If online features are approved

Before implementation, document what players share, expected concurrency, trust boundaries, offline/reconnect behavior, and persistent data. Keep authoritative rules and private credentials server-side. Validate authorization and inputs on the server, use stable language-independent message IDs, and test malformed, replayed, unauthorized, concurrent, timeout, reconnect, and recovery paths. Do not expose raw server errors to players.
