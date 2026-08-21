# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task focuses on enhancing test coverage for Firebase helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The tests should cover basic CRUD operations (add, get, update, delete) and any utility functions within that file. Mock the Firebase SDK as necessary to ensure tests are isolated and fast.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but focus on testing existing logic)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` for the new unit tests)
- `vitest.config.ts` (if minor configuration is needed for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing a few key functions thoroughly rather than all functions superficially.
- Run `npm run build && npm run lint` before finishing.
- Ensure Vitest runs correctly and the new tests pass.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to prevent actual database calls.
- The tests should verify the logic of the helper functions, such as correctly calling Firestore methods with the right arguments and handling successful and error responses.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
