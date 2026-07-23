# Worker Prompt Template

## Context

The `nail-report` application is moving into Phase 2, focusing on stability, test coverage, and UX. The first step in improving test coverage is to add unit tests for critical helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor changes for path aliases if strictly necessary for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts`. Focus on mocking Firebase SDK calls (`firebase/firestore` and `firebase/auth`) to ensure tests are isolated and run quickly.
- Cover at least the `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` functions.
- Ensure proper mocking of Firebase Firestore SDK methods (e.g., `doc`, `collection`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy`).
- Keep diff ≤ 150 lines.
- Run `npm test` to confirm tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
