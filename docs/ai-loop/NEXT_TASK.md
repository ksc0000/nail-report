# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`. This task aligns with Phase 2.1 (Test coverage) of the product roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to production code)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (if minimal setup is required, e.g., to define test environment or mocks)
- `package.json` (only for confirming `vitest` is in dev dependencies; no additions of new npm packages)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (no additions of new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components
- `src/lib/storage.ts`, `src/lib/auth.ts`, `src/lib/publicShares.ts` (scope limited to `firestore.ts` tests)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Implement unit tests for the helper functions defined in `src/lib/firestore.ts`.

**Detailed Steps:**

1.  **Verify Vitest Setup:** Ensure `vitest` is installed (it should be in `devDependencies` in `package.json`). If `vitest.config.ts` does not exist or is minimal, create/update it to support a basic test environment.
2.  **Create Test File:** Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Implement Unit Tests:**
    *   Write unit tests for all exported functions in `src/lib/firestore.ts`.
    *   Focus on testing the logic within these functions, not external Firebase service calls directly.
    *   **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and other Firebase SDK modules as necessary to isolate the functions under test. For example, mock `getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`, etc., so that tests do not make actual network requests.
    *   Ensure test cases cover common scenarios (e.g., successful operations, error conditions if applicable to the `firestore.ts` logic).
    *   Use `expect` assertions to verify the behavior and return values of the functions.
4.  **Run Tests:** Execute `npm test` or `vitest` to ensure all tests pass.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   This file contains unit tests for the helper functions in `src/lib/firestore.ts`.
*   Firebase SDK dependencies are properly mocked in the tests.
*   All new tests pass successfully when `npm test` is run.
*   The overall diff remains within the 150-line limit.

**Required test commands:**

```bash
npm install # if package-lock.json changed
npm run build
npm run lint
npm test
```
