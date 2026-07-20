# Worker Prompt Template

## Context

The project is entering Phase 2, focusing on improving stability, test coverage, and UX. A key part of this phase is adding unit tests for core Firebase helper functions. This task specifically targets the Firestore helper functions.

## Objective

Implement unit tests for the essential CRUD operations related to `nailItems` within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (no functional changes, only ensure testability if needed)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (to ensure Vitest is configured correctly, if necessary)
-   `package.json` (only to add `test` script, if not present, and assuming `vitest` is already a dev dependency, no *new* dependency installations)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval beyond what is expected for Vitest setup, which is assumed to be already present in devDependencies or installable via `npm install`)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vite.config.ts`.

## Requirements

-   Keep diff ≤ 150 lines.
-   Add a new test file: `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least the following functions in `src/lib/firestore.ts`:
    -   `getNailItems`
    -   `addNailItem`
    -   `updateNailItem`
    -   `deleteNailItem`
-   Mock the Firebase Firestore SDK using `vi.mock` to isolate tests from actual Firebase calls.
-   Ensure tests run successfully using `npm test`.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Jules,

Your task is to add unit tests for the core Firestore `nailItem` CRUD operations.

1.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest**: If `vitest` is not already configured to run tests in `src/__tests__/`, ensure `vite.config.ts` is updated to include this. Assume `vitest` is already an `npm` dev dependency.
3.  **Mock Firebase Firestore SDK**: In `src/__tests__/firestore.test.ts`, use `vi.mock('firebase/firestore', ...)` to create mock implementations for Firestore functions like `collection`, `query`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc. This will prevent actual calls to Firebase during tests.
4.  **Write tests**: Implement unit tests for `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`. Focus on testing the logic within these functions, verifying that the correct Firestore SDK methods are called with the expected arguments, and that they handle successful responses and errors as appropriate.
5.  **Run tests**: Execute `npm test` to verify your tests pass.
6.  **Lint and Build**: Run `npm run build && npm run lint` to ensure no new errors are introduced.

Do not add new npm dependencies. Focus strictly on `src/lib/firestore.ts` and its corresponding test file, keeping the diff small.

Good luck!
