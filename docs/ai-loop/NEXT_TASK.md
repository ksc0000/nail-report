# Worker Prompt Template

## Context

The application needs improved stability and test coverage. Phase 2.1 of the roadmap specifically targets unit tests for Firestore helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but prefer to assume it's mostly set up)

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

Implement initial unit tests for key helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Utilize Vitest:** Use Vitest as the test runner.
3.  **Mock Firebase SDK:** Properly mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` to isolate the functions under test.
4.  **Test at least two functions:** Write unit tests for at least two core functions from `src/lib/firestore.ts`. Good candidates include `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`.
5.  **Cover happy paths and basic error handling:** Ensure tests cover the primary successful execution paths and at least one relevant error scenario (e.g., a promise rejection from a mocked Firebase call).
6.  **Focus on initial coverage:** The goal for this task is to establish foundational unit test coverage for `firestore.ts`, not necessarily 100% coverage of the entire file.

**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` is added to the codebase.
- This test file contains unit tests for at least two functions from `src/lib/firestore.ts`.
- Firebase SDK interactions are mocked correctly using `vi.mock`.
- All new tests pass when `npm test` is run.
- `npm run build && npm run lint` execute successfully without errors.
