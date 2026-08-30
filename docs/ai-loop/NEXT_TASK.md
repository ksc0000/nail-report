# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically addresses the `firestore.ts` helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer to only add tests)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `vite.config.ts` (if Vitest setup for mocking Firebase is needed, but avoid adding new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside `src/` except `vite.config.ts` if strictly necessary for testing setup.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Focus on mocking Firebase SDK calls (`firebase/firestore`, `firebase/app`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure test coverage for at least `addNailItem`, `getNailItems`, and `updateNailItem` functions in `src/lib/firestore.ts`.
-   Report follow-up items as comments, not additional code.

## Worker prompt

You are tasked with adding unit tests for the Firestore helper functions.

1.  **Create a test file**: If it doesn't exist, create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up `vi.mock('firebase/firestore')` and potentially `vi.mock('firebase/app')` at the top of your test file to mock all necessary Firestore functions and objects (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the return values and side effects that `firestore.ts` functions expect.
    *   Example: For `getDocs`, you might mock its return to be an object with a `docs` property, where each `doc` has a `data()` method and `id` property.
3.  **Write unit tests**:
    *   **`addNailItem`**: Test that it calls `setDoc` with the correct collection path, document ID, and data.
    *   **`getNailItems`**: Test that it correctly fetches and transforms data from the mocked `querySnapshot`.
    *   **`updateNailItem`**: Test that it calls `updateDoc` with the correct document reference and partial data.
    *   Consider adding tests for `deleteNailItem`, `getNailItem`, and `getNailItemsByTag` if within the line limit.
4.  **Assertions**: Use Vitest's `expect` assertions to verify that the mocked Firebase functions are called with the expected arguments and that the helper functions return the correct values.
5.  **Run tests**: Execute `npm run test` to ensure all new tests pass.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure code quality and build integrity.

### Acceptance Criteria

-   A new test file `src/__tests__/lib/firestore.test.ts` is created.
-   Unit tests cover at least `addNailItem`, `getNailItems`, and `updateNailItem` from `src/lib/firestore.ts`.
-   Firebase SDK calls are effectively mocked, preventing actual network requests.
-   All new tests pass when `npm run test` is executed.
-   The changes result in a diff of 150 lines or less.

### Required Test Commands

```bash
npm install # Ensure all dependencies are installed
npm run build
npm run lint
npm run test
```
