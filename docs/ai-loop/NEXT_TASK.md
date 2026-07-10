# Worker Prompt Template

## Context

The nail-report application is moving into Phase 2, focusing on improving stability, test coverage, and UX. A key initial step is to establish robust unit test coverage for core utility functions. The `src/lib/firestore.ts` file contains essential helper functions for interacting with Firebase Firestore, which currently lack dedicated unit tests.

## Objective

Implement comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if Vitest setup is truly required and its not in place - though the roadmap implies it is chosen)
- `vite.config.ts` (for Vitest configuration, if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval, but existing dev dependencies like `vitest` can be configured/used)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for all public helper functions exported from `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `subscribeToNailItems`, etc.).
- Ensure that Firebase SDK interactions (Firestore instances, collection references, document references, etc.) are properly mocked using `vitest`'s mocking capabilities (`vi.mock`) to ensure tests are isolated and do not require a live Firebase connection.
- Test both successful operations and potential error scenarios (e.g., Firestore write failures).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` or `vitest` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
