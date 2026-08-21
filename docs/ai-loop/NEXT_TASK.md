```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area is to increase test coverage for core helper functions. `src/lib/firestore.ts` contains critical functions for interacting with Firebase Firestore. Adding unit tests for these functions will improve reliability and make future development safer.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves setting up mocks for Firebase SDK dependencies to ensure tests are isolated and fast.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but primarily for understanding its API)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only for verifying `vitest` and related dev dependencies are present, no new dependencies to be added)
- `vite.config.ts` (only for verifying Vitest setup, no modifications needed unless absolutely required for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files outside the `Allowed Scope`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vitest.mock`.
- Write unit tests covering at least the primary CRUD operations (create, read, update, delete) for `nailItems` and `publicShares` if handled by `firestore.ts` helpers.
- Ensure tests are independent and do not rely on actual Firebase backend calls.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
