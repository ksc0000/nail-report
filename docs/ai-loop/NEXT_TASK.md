# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 (Test coverage) is active, with the goal of adding unit tests for Firebase helper functions using Vitest. The current state shows no specific roadmap tasks have been completed by Jules yet. This task focuses on establishing foundational unit tests for Firestore helper functions.

## Objective

Implement Vitest unit tests for helper functions defined in `src/lib/firestore.ts`. The task should focus on testing the logic of these functions, mocking Firebase SDK interactions as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily for understanding what to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor Vitest configuration adjustments are absolutely necessary, but prioritize existing setup)

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

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Identify key functions:** Examine `src/lib/firestore.ts` and choose 2-3 core helper functions (e.g., for creating, reading, updating, or deleting nail items) to test.
3.  **Implement unit tests:**
    *   Write `describe` and `it` blocks for the chosen functions.
    *   Mock Firebase SDK interactions (e.g., `firebase/firestore`, `firebase/app`) using `vi.mock()` as specified in the roadmap. Do not make actual calls to Firebase during tests.
    *   Focus on testing the internal logic, argument handling, and return values of the helper functions.
    *   Ensure tests cover basic success cases and relevant error paths or edge cases (e.g., invalid input if applicable).

### Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains unit tests for at least 2-3 helper functions from `src/lib/firestore.ts`.
- Firebase SDK dependencies are properly mocked within the tests.
- All new tests pass when running `npm test`.

### Required Test Commands

```bash
npm install # Ensure dependencies are up to date
npm run test # Verify all tests pass, including the new ones
npm run build && npm run lint # Ensure the project builds and lints correctly
```
