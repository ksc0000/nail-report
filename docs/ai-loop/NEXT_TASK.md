```markdown
# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task includes setting up Vitest if it's not already fully configured for testing, though the roadmap indicates Vitest is the chosen test runner.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but primarily for understanding what to test)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minimal configuration for Vitest if absolutely required, e.g., for aliases or setup files, but prefer to assume it's mostly ready)
-   `package.json` (only for adding `test` script if not present, no new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file not explicitly mentioned in "Allowed Scope"

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for `src/lib/firestore.ts` helper functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Mock Firebase SDK using `vi.mock` to isolate tests from actual Firebase interactions.
-   Ensure tests run successfully using `npm test` or `vitest`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Verify Vitest Setup:**
    *   Check `package.json` for Vitest scripts (e.g., `"test": "vitest"`). If absent, add a minimal `test` script.
    *   Ensure `vite.config.ts` has basic Vitest configuration, if not, add a minimal `test` property to the defineConfig object to enable Vitest.

2.  **Create Test File:**
    *   Create a new file: `src/__tests__/lib/firestore.test.ts`.

3.  **Implement Mocking:**
    *   Use `vi.mock('firebase/firestore')` and `vi.mock('firebase/app')` to mock Firebase Firestore and App SDK functions.
    *   Mock relevant Firestore functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to simulate their behavior without real database calls.

4.  **Write Unit Tests:**
    *   For each major helper function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`), write at least one positive test case.
    *   Consider adding one or two basic error handling tests if applicable (e.g., what happens if a Firestore operation rejects).

5.  **Run Tests:**
    *   Execute `npm test` (or `vitest`) and ensure all new tests pass.

6.  **Lint and Build:**
    *   Run `npm run lint` and `npm run build` to confirm there are no new linting errors or build issues.

```
```
```
