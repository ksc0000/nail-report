# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A critical part of stability is having robust unit tests for core helper functions. `src/lib/firestore.ts` contains essential functions for interacting with the Firestore database.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies to ensure tests are isolated and reliable.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments if necessary to improve testability, but the primary focus is testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/*.ts` (additional test helper files if absolutely necessary, but prefer to keep mocks local)
- `vite.config.ts` (only if Vitest configuration specifically for mocking or test setup is required, which is unlikely for a basic unit test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, or any other UI components

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for the primary functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem` (or similarly named CRUD functions).
- Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `collection`) to prevent actual database calls during tests.
- Ensure test cases cover successful operations and potential error scenarios (e.g., Firestore throwing an error).
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- All tests must pass: `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
