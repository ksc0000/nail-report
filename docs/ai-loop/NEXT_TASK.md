# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area for improvement is adding comprehensive unit tests, particularly for Firebase interaction helper functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, ensuring that Firebase SDK interactions are properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactors)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding/modifying Vitest configuration if absolutely necessary, **no new npm dependencies**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least 2-3 functions in `src/lib/firestore.ts` that interact with Firestore (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getPublicShare`).
- Use `vi.mock` to mock Firebase SDK's Firestore functionalities (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`) to ensure tests are isolated and do not hit actual Firebase services.
- Ensure the tests cover basic success cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings.
- Run `npm test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
