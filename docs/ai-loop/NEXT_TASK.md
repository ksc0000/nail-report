# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap: Add Vitest + unit tests for `src/lib/firestore.ts` helpers.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration, if necessary, but prefer existing setup)
- `package.json` (only for adding `vitest` script if missing, no new dependencies)

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

Your task is to add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock('firebase/firestore')` and any other relevant Firebase modules to mock Firestore SDK calls, ensuring tests are isolated and do not interact with actual Firebase services. Focus on mocking the functions directly called by `src/lib/firestore.ts`.
3.  **Write Unit Tests**: For each significant helper function exported from `src/lib/firestore.ts` (e.g., functions for adding, getting, updating, deleting nail items, or any other utility functions specific to Firestore operations), write at least one unit test case.
4.  **Test Coverage**: Aim for reasonable test coverage for the functions in `src/lib/firestore.ts`.
5.  **Run Tests**: Ensure all new tests pass by running `npm test`.

**Acceptance Criteria:**
- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains mocked Firebase Firestore SDK methods.
- At least two helper functions from `src/lib/firestore.ts` have dedicated unit tests.
- All new tests pass successfully when `npm test` is run.

**Required Test Commands:**
```bash
npm install # Ensure all dependencies are up to date
npm run build
npm run lint
npm test
```
