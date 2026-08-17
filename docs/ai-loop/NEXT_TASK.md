# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" aspect by adding unit tests for existing utility functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/` (minor adjustments only if absolutely necessary for testing `firestore.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`).
- Ensure tests cover typical success cases and basic error handling scenarios.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- The tests should be isolated and not rely on actual Firebase Emulators or live Firebase instances.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
