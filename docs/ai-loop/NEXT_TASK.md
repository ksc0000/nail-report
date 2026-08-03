# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest. The primary goal is to ensure the helper functions that interact with Firestore (e.g., fetching, creating, updating, deleting nail items) work as expected by mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if necessary, but primarily for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils/mockFirebase.ts` (new file for Firebase mocking utilities if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Ensure tests effectively mock the Firebase Firestore SDK to isolate the logic in `src/lib/firestore.ts`.
- Focus on testing the primary CRUD operations (e.g., `getNailItems`, `createNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests pass with `npm run test`.

## Worker prompt

### Summary of what changed

Added a new test file `src/__tests__/firestore.test.ts` containing unit tests for the helper functions in `src/lib/firestore.ts`. Firebase Firestore SDK calls are mocked to allow isolated testing.

### Changed files list

- `src/__tests__/firestore.test.ts` (new)
- (Potentially minor modifications to `src/lib/firestore.ts` if refactoring for testability is required, but aim to minimize changes to existing logic.)

### Commands run and results

```bash
npm install # (if any new devDependencies were implied by vitest setup - though vitest itself is assumed to be setup)
npm run test # Expected: All new tests for firestore.ts pass
npm run build # Expected: Build succeeds without errors
npm run lint # Expected: No linting errors
```

### Known issues or limitations

- The current implementation only covers basic CRUD operations. More complex scenarios (e.g., error handling from Firestore, edge cases) could be added in future iterations.
- No new npm packages were added, assuming Vitest and necessary mocking libraries are already configured.

### Suggested next task

Add Vitest unit tests for the helper functions in `src/lib/storage.ts`, focusing on image upload and deletion logic.
