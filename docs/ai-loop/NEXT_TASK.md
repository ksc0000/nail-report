# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by introducing Vitest and adding unit tests for a core Firebase utility file.

## Objective

Implement exactly one bounded task from Phase 2: Add Vitest + unit tests for `src/lib/firestore.ts` helpers.

Specifically:
1.  Ensure Vitest is set up and configured correctly in the project (e.g., in `vite.config.ts`).
2.  Create a new test file `src/__tests__/firestore.test.ts`.
3.  Add unit tests for the functions within `src/lib/firestore.ts`. Focus on testing the core CRUD operations such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (assuming these functions exist).
4.  Mock Firebase SDK dependencies using `vi.mock` as necessary to isolate `firestore.ts` logic for unit testing.
5.  Tests should verify that the functions correctly interact with the mocked Firebase services (e.g., `collection`, `doc`, `setDoc`, `getDocs`, `updateDoc`, `deleteDoc`).

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily adding tests for it)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (for Vitest configuration, if not already present)
-   `package.json` (to add `vitest` and related testing dev dependencies, as explicitly required by Phase 2.1 of the roadmap)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   Any new *runtime* npm packages (dev dependencies for testing, like Vitest, are allowed as per roadmap)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure Vitest is properly configured to run tests.
-   Mocks for Firebase SDK should be robust enough to test the `firestore.ts` functions in isolation.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

**Worker prompt:**

```markdown
# Worker Prompt

## Context

The current task is to kickstart test coverage by implementing unit tests for the Firebase Firestore utility functions. This is a direct implementation of "Phase 2.1 Test coverage" from the roadmap.

## Objective

Introduce Vitest to the project if not already present, configure it for running unit tests, and write initial unit tests for the functions defined in `src/lib/firestore.ts`.

## Detailed Steps

1.  **Vitest Setup (if needed):**
    *   If `vitest` is not in `package.json`'s `devDependencies`, add it. You might also need `@vitest/coverage-v8` for coverage reporting, and `jsdom` for environment.
    *   Configure `vite.config.ts` to include Vitest settings. Ensure `test.environment` is set to `jsdom` if DOM interactions are relevant (though not strictly for `firestore.ts` itself, it's a common setup).
    *   Add a test script to `package.json` (e.g., `"test": "vitest"`).

2.  **Create Test File:**
    *   Create a new file `src/__tests__/firestore.test.ts`.

3.  **Mock Firebase SDK:**
    *   Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firebase Firestore functions and objects (e.g., `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`).
    *   Ensure mocks return predictable values or resolve promises appropriately to simulate Firebase responses.

4.  **Write Unit Tests for `src/lib/firestore.ts`:**
    *   Focus on the main CRUD helper functions: `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`.
    *   Each function should have at least one test case verifying its successful execution path.
    *   Consider edge cases where a function might throw an error (e.g., invalid input, though mocking might not fully cover this without more complex setup). For this task, prioritize successful path testing.
    *   Use `expect` assertions to verify that the mocked Firebase functions were called with the correct arguments and that the `firestore.ts` functions return expected values.

## Acceptance Criteria

-   `npm test` runs successfully without errors.
-   `src/__tests__/firestore.test.ts` exists and contains unit tests for at least `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (if they exist in `src/lib/firestore.ts`).
-   Firebase SDK interactions within `firestore.ts` are mocked, isolating the logic of the helper functions.
-   The changes result in a diff of ≤ 150 lines.

## Required Test Commands

```bash
npm install # if new dev dependencies were added
npm run test
npm run build
npm run lint
```

## Output Summary

```markdown
### Summary of changes

Introduced Vitest as the unit test runner and created `src/__tests__/firestore.test.ts` with initial unit tests for the Firebase Firestore helper functions (`addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) in `src/lib/firestore.ts`. Firebase SDK was mocked using `vi.mock` to allow isolated testing.

### Changed files

- `package.json` (added vitest dev dependency)
- `vite.config.ts` (updated for Vitest configuration)
- `src/__tests__/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (minor changes if needed for testability, e.g., exports)

### Commands run and results

```bash
# npm install -D vitest @vitest/coverage-v8 jsdom # (if vitest not present)
# npm install
# npm run test
# npm run build
# npm run lint
```
(Provide actual output here)

### Known issues or limitations

*   Error handling paths for Firestore functions are not extensively tested in this initial pass.
*   Only basic CRUD operations in `firestore.ts` are covered; other utility functions (if any) are not yet tested.

### Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
```
