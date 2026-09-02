```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task addresses the "Test coverage" aspect by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for key helper functions within `src/lib/firestore.ts`. The initial focus should be on establishing the testing pattern and covering a few fundamental CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor bug fixes discovered during testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` is not already a devDependency or for adding test script, otherwise forbidden)
- `vite.config.ts` (for Vitest configuration, if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, unless `vitest` is missing from devDependencies)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files outside the specified `Allowed Scope`.

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Implement mocks for the Firebase Firestore SDK using `vitest`.
- Write unit tests for at least two core functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`, ensuring basic success scenarios are covered.
- Run `npm test` to confirm tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement the first set of unit tests for `src/lib/firestore.ts` using Vitest.

1.  **Configure Vitest (if necessary):** Verify that Vitest is set up correctly in `vite.config.ts` and that `npm test` runs. If `vitest` is not in `devDependencies` in `package.json`, add it (this is an exception to the `no-new-npm-deps` rule for `vitest` itself, but do not add *other* new deps).
2.  **Create Test File:** Create a new file `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase Firestore:** Implement mock functions for the Firebase Firestore SDK that `src/lib/firestore.ts` interacts with. This will involve using `vi.mock` to simulate `firebase/firestore` modules and their methods (e.g., `collection`, `addDoc`, `getDocs`, `doc`, `getDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the necessary parts for the functions you'll test.
4.  **Write Unit Tests:**
    *   Add a test suite for `src/lib/firestore.ts`.
    *   Implement unit tests for `addNailItem`. Ensure it correctly calls `addDoc` with the provided data and returns the expected result.
    *   Implement unit tests for `getNailItems`. Ensure it correctly calls `getDocs` and processes the snapshot into the expected array of nail items.
5.  **Run Tests:** Execute `npm test` to ensure all new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to verify no linting errors or build issues are introduced.

This task is designed to be small, covering the setup of Firebase mocking and testing for two fundamental CRUD operations.
```
