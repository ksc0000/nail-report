# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest, including basic mocking of the Firebase SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)
- `vitest.config.ts` (minimal setup if required)

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

## Worker Prompt

Your task is to add initial unit tests for select functions in `src/lib/firestore.ts`.

1.  **Ensure Vitest is configured:** If a `vitest.config.ts` file does not exist or is not set up to run `.test.ts` files, create or modify it minimally to allow Vitest to discover and run tests in `src/__tests__/`. Focus on basic configuration for TypeScript and `src` alias if needed.
2.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
3.  **Mock Firebase SDK:** Within `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock relevant Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, etc.) that are used by the `firestore.ts` helpers.
4.  **Implement unit tests:**
    *   Choose **one or two** of the most critical or representative helper functions from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, or `updateNailItem`).
    *   Write unit tests for these selected functions to cover their basic functionality. Focus on ensuring they call the correct mocked Firebase functions with the expected arguments and return the expected values.
    *   Keep the tests concise and focused to stay within the line limit.

### Acceptance Criteria:

-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   `vitest.config.ts` is present and correctly configured to run tests.
-   At least one helper function from `src/lib/firestore.ts` has corresponding unit tests.
-   Firebase Firestore SDK calls within the tested helper functions are effectively mocked using `vi.mock`.
-   All new tests pass successfully.

### Required test commands:

```bash
npm test
npm run build
npm run lint
```
