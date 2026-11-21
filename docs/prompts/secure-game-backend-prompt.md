# Task: Design and build a secure backend for my game

You are a senior game backend architect and security-minded software engineer.

## Project context

- Game and genre: A new browser game built with Three.js, TypeScript, and Vite. The gameplay and online requirements have not been defined yet. Inspect the project and do not invent game features.
- Current frontend or engine: Three.js
- Preferred backend language: [NODE.JS / PYTHON / RUST / RECOMMEND ONE]
- Preferred framework: [EXPRESS / NEXT.JS / DJANGO / FLASK / AXUM / RECOMMEND ONE]
- Multiplayer or shared-state features: [DESCRIBE THEM]
- Target platforms: Web
- Expected launch scale: A small private prototype. No online concurrency is planned; launch scale is unknown

## Instructions

1. Inspect the current repositories, architecture, conventions, dependencies, and documentation before changing anything.
2. Propose an architecture that keeps the backend authoritative for scores, combat results, progression, inventory, currencies, purchases, matchmaking, permissions, and persistent player data.
3. Never place database credentials, private keys, admin tokens, or other secrets in the frontend. Explain how secrets and environment configuration will be managed.
4. Protect every non-public route with appropriate authentication and authorization. Use JWT or a better existing project convention, and prevent players from mutating data outside the game's intended rules.
5. Centralize database access behind a testable, database-agnostic layer. Include schema design, migrations, indexes, constraints, and rollback guidance.
6. Use the project's existing package manager and stable, maintained packages. Do not add a dependency unless it has a clear purpose.
7. Follow modular design patterns so game systems can be tested, replaced, and scaled independently.
8. Add unit, integration, route, authorization, and end-to-end tests. Cover invalid input, replayed requests, unauthorized access, concurrency, rate limits, and failure recovery.
9. Add useful inline comments where reasoning is not obvious, plus architecture and setup documentation in the docs folder.
10. Preserve existing working behavior. If the frontend currently owns sensitive game logic, identify it and migrate it safely to the backend.

## Required output

Before implementation, provide:

- A short audit of the current system.
- The proposed architecture and data flow.
- Security and scaling risks.
- A phased implementation plan.

Then implement the approved approach, run the relevant tests, report the results, and document how developers can run, test, and extend the backend.

## Internationalization and localization architecture

Build internationalization into the existing architecture before gameplay and UI content multiply. Do not create a separate localization application or bolt translation onto finished screens.

- Centralize player-facing text behind stable translation keys and locale resources. Do not hard-code display strings in gameplay, menus, tutorials, errors, notifications, subtitles, or content data.
- Define a fallback locale, missing-key behavior, resource ownership, extraction and validation commands, translator notes, and a safe process for adding or updating a language.
- Support Unicode, plural/select rules through an ICU-style message system or the engine's equivalent, locale-aware number/date/time/currency/unit formatting, and invariant internal IDs for saves, networking, analytics, achievements, and game rules.
- Plan for right-to-left layout and bidirectional text, CJK and other line-breaking rules, diacritics, input methods and IME where players type, font fallback and glyph coverage, translated text expansion, subtitles/captions, localized audio or asset variants where required, and runtime language selection with a persisted preference.
- Keep localization data separate from trusted game rules. Servers, SDKs, automation, and analytics should exchange stable language-independent identifiers while clients turn them into localized player-readable text.
- Add pseudolocalization, missing/unused-key validation, fallback-locale tests, long-string and text-expansion tests, right-to-left tests, font/glyph checks, and representative locale screenshots to the normal test and CI strategy.

Document the supported launch locales, later-locale workflow, ownership, file locations, naming rules, formatting rules, font and audio strategy, platform limitations, and exact commands another developer or translator uses.

## Player-readable output requirement

Everything shown to a player must be written and presented for a human player, not for a developer or debugger. This includes menus, HUD labels, buttons, prompts, tutorials, objectives, dialogue, tooltips, loading and save states, empty states, confirmations, warnings, errors, rewards, notifications, accessibility messages, and connection or recovery states.

Use concise plain language, the game's established terminology and tone, recognizable icons with text where meaning could be ambiguous, and a clear next action. A player-facing error should explain what happened in useful terms, whether progress is safe, and what the player can do next.

Never expose raw exceptions, stack traces, JSON, database IDs, internal event names, enum or variable names, file paths, debug coordinates, HTTP status codes without explanation, server implementation details, developer TODOs, placeholder text, or raw telemetry on a player-facing surface. Send technical details to development-only logs, diagnostics, telemetry, or an authenticated support view. A short support reference code may be shown to the player only when it helps support locate the private diagnostic record.

Verify representative success, failure, offline, loading, empty, permission, validation, timeout, save, reconnect, and recovery states from the player's perspective. Developer documentation and final engineering reports may remain technical; this requirement applies to anything the game presents to players.

## Required game documentation

Documentation is part of the definition of done for this task.

Before finishing:

1. Read the existing README, docs directory, architecture notes, decision records, and AI instructions that apply to this system.
2. Update the existing relevant documentation instead of creating a competing document or a second source of truth.
3. If no relevant document exists, create a clearly named Markdown document in the game's established documentation directory. Use docs/ when the project has no existing convention.
4. Document the current system, the decisions made, ownership and lifecycle rules, configuration, files or assets changed, commands and tests run, known limitations, and how another developer should extend or troubleshoot the work.
5. Update AI_INSTRUCTIONS.md or the project's equivalent when this task changes architectural boundaries, required workflows, naming rules, or validation commands.
6. Keep documentation accurate to the implementation. Do not claim support, measurements, or test coverage that was not verified.
7. In the final report, list every documentation file created or updated.