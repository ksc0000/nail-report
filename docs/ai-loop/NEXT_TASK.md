# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that test coverage is a priority. This task will initiate unit testing for core Firebase helper functions, starting with Firestore.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only to add Vitest setup if not already present, but *no new npm dependencies*)
- `vite.config.ts` (only to configure Vitest if not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the specified allowed scope

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Focus on testing key functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for testing and mock Firebase SDK dependencies appropriately.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions. This will involve:

1.  **Setting up Vitest (if not already done):** Ensure `vitest` is configured in `package.json` scripts and `vite.config.ts`. If `vitest` and `@vitest/coverage-v8` are not already in `devDependencies`, you may add them, but ensure *no new npm packages are added that are not directly related to Vitest setup*. Refer to the `vitest` documentation for basic setup.
2.  **Creating a test file:** Create `src/__tests__/lib/firestore.test.ts`.
3.  **Mocking Firebase:** Implement mocks for Firebase Firestore functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to isolate the `firestore.ts` logic.
4.  **Writing tests:** Write unit tests for at least the following functions in `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
    Ensure tests cover successful operations and basic error scenarios if applicable and easily mockable.

### Acceptance criteria

-   A new file `src/__tests__/lib/firestore.test.ts` exists and contains unit tests for `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
-   Firebase Firestore dependencies are mocked effectively.
-   The tests pass when `npm run test` is executed.
-   The changes adhere to the line diff limit and forbidden scope.

### Required test commands

```bash
npm install # Only if adding Vitest to devDependencies
npm run build
npm run lint
npm run test # To run the newly added tests
```
