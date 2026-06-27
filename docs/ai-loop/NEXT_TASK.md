# Worker Prompt Template

## Context

The application needs improved test coverage for its core Firebase interactions. The current phase focuses on improving stability and test coverage for utility functions.

## Objective

Implement unit tests for the `addItem` and `getItems` functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK dependencies effectively.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactors to improve testability if strictly necessary, but prioritize testing existing interface)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but typically not for simple unit tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests specifically for the `addItem` and `getItems` functions in `src/lib/firestore.ts`.
- Utilize `vi.mock` to mock Firebase SDK methods (e.g., `addDoc`, `collection`, `getDocs`, `query`, `orderBy`, `limit`) to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure test cases cover successful operations and basic error handling for these functions.
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
