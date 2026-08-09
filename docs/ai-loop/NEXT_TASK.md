# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "Test coverage" objective by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for selected functions within `src/lib/firestore.ts` using Vitest and mock Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to change production code unless it's refactoring to enable testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup is explicitly needed, e.g., for global mocks or specific test configuration)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Implement unit tests for a few core helper functions in `src/lib/firestore.ts`.

1.  **Identify target functions:** Review `src/lib/firestore.ts` and select 2-3 key functions that interact with Firestore (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or similar CRUD operations). Prioritize functions that have clear input/output and side effects with the Firestore SDK.
2.  **Create test file:** Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Implement tests using Vitest:**
    *   For each selected function, write unit tests to verify its logic.
    *   **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to prevent actual database calls during tests. Focus on testing the application logic within `src/lib/firestore.ts`, not the Firebase SDK itself.
    *   Ensure mocks return predictable values or handle promises correctly to simulate successful and potentially failed Firestore operations.
    *   Use Vitest's `expect` assertions to verify function behavior and return values.
4.  **Ensure test isolation:** Each test should run independently without affecting other tests or requiring a live Firebase connection.
5.  **Adhere to best practices:** Write clear, concise, and focused tests.

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is created.
-   At least 2-3 key functions from `src/lib/firestore.ts` are covered by unit tests.
-   Firebase Firestore SDK interactions are effectively mocked using `vi.mock`.
-   All new tests pass successfully when `npm test` is run.
-   The code adheres to linting and build standards (`npm run lint`, `npm run build`).

### Required Test Commands

```bash
npm test
npm run build
npm run lint
```
