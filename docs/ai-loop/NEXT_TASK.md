# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin adding unit test coverage for the core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (Read for implementation details, minor modifications for testability are allowed if strictly necessary and minimal)
- `src/__tests__/lib/firestore.test.ts` (New file for tests)
- `vite.config.ts` (If Vitest configuration for mocking Firebase SDK is needed)
- `package.json` (Only to verify `vitest` dependency, no new packages)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/lib/firestore.test.ts`.
- Write at least 2-3 unit tests for distinct helper functions found in `src/lib/firestore.ts`. Focus on functions that interact with the Firestore SDK.
- The tests must effectively mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` to ensure isolated unit testing.
- Do not modify the existing application logic in `src/lib/firestore.ts` unless it is a minor refactor strictly required for testability and does not alter behavior.
- Ensure the tests are robust and pass.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
