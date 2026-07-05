# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement Vitest unit tests for the helper functions in `src/lib/firestore.ts`, focusing on setting up the testing environment and mocking Firebase Firestore.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to enable testing if absolutely necessary, but prioritize new test files)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration if required, e.g., setupFiles)
- `package.json` (for adding Vitest scripts if not already present, but no new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except if `vitest` itself is not yet installed – check `package.json` first)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Add `vitest` configuration to `vite.config.ts` if not already present.
- Create a new test file, `src/__tests__/lib/firestore.test.ts`.
- Implement mocking for Firebase Firestore SDK using `vi.mock('firebase/firestore')` to isolate `src/lib/firestore.ts` functions.
- Write at least two passing unit tests for key functions within `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Tests should verify correct interaction with the mocked Firestore API (e.g., `addDoc` or `getDocs` being called with expected arguments).
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` or `npm run test` (whichever is configured) to ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
