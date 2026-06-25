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

# Worker prompt

## Objective

Add Vitest unit tests for helper functions within `src/lib/firestore.ts`.

## Details

The goal is to improve test coverage for the core Firestore operations.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use Vitest's `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate `src/lib/firestore.ts` functions for testing. You may need to mock `firebase/auth` if authentication-related context is used in `firestore.ts` helpers.
3.  **Implement Unit Tests:** Focus on adding tests for the key helper functions that perform CRUD operations on the `nailItems` collection (e.g., functions for adding, getting, updating, and deleting nail items).
4.  **Coverage:** Aim for good test coverage for the functions you are testing.

## Acceptance Criteria

-   A new test file `src/__tests__/firestore.test.ts` is created and contains unit tests.
-   Key helper functions in `src/lib/firestore.ts` are covered by these tests.
-   Tests pass successfully when `npm test` is run.
-   The new code adheres to existing linting rules and the project builds successfully.

## Required Test Commands

-   `npm test`
-   `npm run build`
-   `npm run lint`
