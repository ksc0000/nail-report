```markdown
# Worker Prompt Template

## Context

The current development phase is 2.0, focusing on improving application stability, test coverage, and user experience. This task initiates the test coverage efforts by adding unit tests for a critical part of the application: the Firebase Firestore helper functions.

## Objective

Add unit tests for helper functions in `src/lib/firestore.ts` using Vitest. Specifically, implement tests for at least one of the Firestore CRUD operation functions (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`).

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)
- `vite.config.ts` (for minimal Vitest configuration if strictly necessary for mocking setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`, to house the unit tests.
- Implement unit tests for at least one of the Firestore CRUD helper functions found in `src/lib/firestore.ts`.
- Ensure Firebase SDK functions (e.g., `addDoc`, `collection`, `getDocs`, `updateDoc`, `deleteDoc`) are properly mocked using `vitest`'s `vi.mock` mechanism to isolate the function logic under test.
- Verify that the newly added tests pass successfully when executing `npm run test`.
- The overall diff for this task must not exceed 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
