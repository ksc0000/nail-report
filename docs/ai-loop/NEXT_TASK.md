```markdown
# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no changes to core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration is absolutely necessary, e.g., adding a test environment, but prefer existing setup)
- `package.json` (only to add a `test` script if not present, but Vitest is expected to be configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure tests effectively mock Firebase SDK calls to isolate the `firestore.ts` logic.
- Focus on testing the primary success and error paths for the helper functions.
- Do not introduce new `npm` dependencies.

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions.

1.  **Create Test File**: Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Implement Tests**:
    *   Write unit tests for the functions exposed in `src/lib/firestore.ts`.
    *   Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, etc.). This ensures tests focus solely on the logic within `firestore.ts` without making actual calls to Firebase.
    *   Ensure tests cover typical CRUD operations (e.g., adding, getting, updating, deleting items) and gracefully handle potential Firestore errors or non-existent documents.
3.  **Run Tests**: Verify that `npm run test` executes your new tests successfully.
4.  **No New Dependencies**: Do not add any new packages to `package.json`. Vitest is already part of the project.

**Acceptance Criteria:**

*   A new test file `src/__tests__/lib/firestore.test.ts` exists.
*   The tests cover the main helper functions in `src/lib/firestore.ts`.
*   Firebase SDK calls are correctly mocked.
*   All new tests pass when running `npm run test`.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are in sync
npm run build
npm run lint
npm run test
```
```
