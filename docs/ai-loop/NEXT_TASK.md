# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

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

### Goal

Add unit tests for helper functions in `src/lib/firestore.ts` using Vitest, specifically targeting Firebase Firestore interactions. This task addresses Phase 2.1 Test coverage.

### Details

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and other necessary Firebase SDK modules to isolate tests from actual Firebase services. The mocks should simulate the expected behavior of Firestore functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc`.
3.  **Write unit tests:** Implement unit tests for at least two core helper functions within `src/lib/firestore.ts`. Good candidates include `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`.
4.  **Focus on logic:** Ensure tests verify that the helper functions correctly interact with the mocked Firestore instance (e.g., calling the correct mocked functions with the expected arguments, handling success/failure scenarios).

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is added.
-   This new file contains unit tests for at least two functions from `src/lib/firestore.ts`.
-   Firebase SDK dependencies are properly mocked within the tests to ensure isolation.
-   All new and existing tests pass when `npm run test` is executed.
-   The diff is within the 150-line limit.

### Required test commands

-   `npm run test` (all tests must pass)
-   `npm run build`
-   `npm run lint`
