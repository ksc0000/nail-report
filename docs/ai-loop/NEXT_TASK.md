# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses "2.1 Test coverage" by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on key CRUD operations or data manipulation functions.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, e.g., named exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for test setup, but prefer to assume Vitest is configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vitest`'s mocking capabilities.
- Cover at least 2-3 key helper functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem` or related utilities) with basic unit tests.
- Ensure tests run successfully using `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Import relevant functions:** Import the functions from `src/lib/firestore.ts` that you intend to test. You may need to ensure they are properly exported (e.g., `export const addNailItem = ...`).
3.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and any other Firebase SDK modules that `firestore.ts` depends on. Focus on mocking the Firestore methods (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to simulate their behavior without actual Firebase calls.
4.  **Write unit tests:**
    *   For each chosen helper function, write `describe` blocks and `it` tests.
    *   Test successful scenarios (e.g., adding an item works, fetching items returns expected data).
    *   Consider testing error handling paths if easily mockable (e.g., what happens if `addDoc` rejects).
5.  **Run tests:** Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build:** Run `npm run build && npm run lint` to confirm no new errors are introduced.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- At least 2-3 core helper functions from `src/lib/firestore.ts` have corresponding unit tests.
- Firebase SDK calls are mocked to prevent actual network requests.
- All new tests pass when `npm test` is run.
- The build and lint checks pass.
