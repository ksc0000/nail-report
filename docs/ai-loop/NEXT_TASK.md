# Worker Prompt Template

## Context

The application needs improved test coverage, especially for core utility functions interacting with Firebase. This task focuses on adding unit tests for the Firestore helper functions to ensure their stability and correctness. Vitest is already configured as the test runner.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls effectively to test business logic in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration is strictly necessary for mocking, but avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two key functions within `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK calls (e.g., `doc`, `collection`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`) are mocked using `vi.mock('firebase/firestore')` or similar Vitest mocking utilities.
- Tests should cover typical success scenarios and at least one error scenario per tested function.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
