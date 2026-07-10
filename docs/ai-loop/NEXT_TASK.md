```markdown
# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and user experience. This task specifically addresses the "Test coverage" goal by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes for testability if strictly necessary, but prefer not to modify core logic)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `package.json` (only to add a `test` script if not present, no new dependencies)
-   `vite.config.ts` (to configure Vitest if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (no new npm packages without human approval, except for Vitest configuration if necessary for a `test` script)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add comprehensive unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a New Test File**: Create a new file named `src/__tests__/lib/firestore.test.ts`.
2.  **Configure Vitest**: Ensure Vitest is set up to run tests. If `package.json` does not have a `test` script, add one that runs `vitest`.
3.  **Mock Firebase SDK**: Use `vi.mock('firebase/firestore')` to mock the Firebase Firestore SDK. You will need to mock the necessary functions like `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`, `query`, `where`, etc., to simulate Firestore behavior without making actual network calls.
4.  **Test Core Functions**: Focus on testing the primary CRUD and retrieval functions in `src/lib/firestore.ts`, such as:
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getNailItems`
    *   `getNailItem`
    *   `getPublicShare`
5.  **Cover Success and Error Paths**: For each function, write tests that cover successful execution paths and at least one common error scenario (e.g., Firestore operation failing).
6.  **Assertion Library**: Use Vitest's built-in assertion library (`expect`).
7.  **Isolate Tests**: Ensure each test is independent and does not rely on the state of other tests.

**Acceptance Criteria**:
-   A new file `src/__tests__/lib/firestore.test.ts` is created.
-   The new test file includes unit tests for the main functions in `src/lib/firestore.ts`.
-   Firebase Firestore SDK is mocked appropriately to allow testing in isolation.
-   Tests cover both successful operations and basic error handling where relevant.
-   All tests pass when running `vitest`.

**Required Test Commands**:
```bash
npm install # Only if vitest is not installed as a dev dependency already.
npm test # To run the new unit tests
npm run build
npm run lint
```
```
