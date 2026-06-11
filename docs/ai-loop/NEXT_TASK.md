# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` (or similar core CRUD functions if these names don't exist) helper functions in `src/lib/firestore.ts`. This involves setting up mock Firebase SDK calls using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Please implement the following:

### Task: Add Vitest unit tests for `src/lib/firestore.ts`

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase SDK functions that `src/lib/firestore.ts` interacts with (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, etc., from `firebase/firestore`).
3.  **Implement tests for `addNailItem`**: Write unit tests to verify the behavior of the `addNailItem` function (or a similar function responsible for adding a new nail item) in `src/lib/firestore.ts`. Ensure it correctly calls the mocked Firebase functions with the expected arguments.
4.  **Implement tests for `getNailItems`**: Write unit tests to verify the behavior of the `getNailItems` function (or a similar function responsible for fetching nail items) in `src/lib/firestore.ts`. Ensure it correctly calls the mocked Firebase functions and processes the returned data as expected.
5.  **Focus on isolation**: Ensure tests rely entirely on mocks and do not make actual network requests to Firebase.

### Acceptance Criteria:

-   A new file `src/__tests__/firestore.test.ts` exists.
-   At least two core CRUD helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`) have dedicated unit tests.
-   Firebase SDK dependencies are correctly mocked using `vi.mock`.
-   All new tests pass when `npm test` is run.
-   The changes adhere to the line diff and forbidden scope constraints.

### Required Test Commands:

-   `npm test` (to run the new Vitest tests)
-   `npm run build`
-   `npm run lint`
