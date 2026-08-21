# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but prefer not to alter functionality)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (read-only, to confirm Vitest is present, do not modify)

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

## Worker prompt

You are an expert React/TypeScript developer. Your task is to add unit tests for the helper functions within `src/lib/firestore.ts`.

1.  **Identify helper functions:** Review `src/lib/firestore.ts` and identify pure functions or small utility functions that can be tested in isolation.
2.  **Create a test file:** Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
3.  **Set up Vitest:** Assume Vitest is already configured and available as a development dependency. Do *not* add any new npm dependencies.
4.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase SDK imports (e.g., `firebase/firestore`) to ensure tests are isolated and don't interact with a live Firebase project. Focus on mocking the specific functions used by `firestore.ts` helpers.
5.  **Write unit tests:** Implement unit tests for at least two key helper functions in `src/lib/firestore.ts`. Aim for good coverage, testing different input scenarios and expected outputs, as well as error conditions if applicable.
6.  **Ensure test isolation:** Tests should be independent and not rely on global state or external services (beyond the mocked Firebase SDK).
7.  **Do not modify main application logic:** Keep changes to `src/lib/firestore.ts` to an absolute minimum, preferably none, or only minor adjustments to improve testability (e.g., exporting a non-exported helper if strictly necessary for testing, but prefer to test through public API).
8.  **Run tests:** Execute `npm test` or `vitest` to ensure all new tests pass.

**Acceptance Criteria:**

- A new test file `src/__tests__/firestore.test.ts` is created.
- At least two helper functions from `src/lib/firestore.ts` have dedicated unit tests.
- Firebase SDK interactions within `firestore.ts` are properly mocked in the tests.
- All new tests pass successfully.
- The PR diff is ≤ 150 lines.

**Required Test Commands:**

```bash
npm install # Only if absolutely necessary for initial setup, but prefer not to add deps.
npm run build
npm run lint
npm test
```
