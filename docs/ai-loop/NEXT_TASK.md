# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to sub-phase 2.1, which aims to add unit tests for key application logic.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. This task should focus on setting up the testing environment for Firestore helpers, including mocking the Firebase SDK, and writing tests for at least one or two specific functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup for mocks is required, but prefer to add mocks directly in the test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Use Vitest for testing.
- Mock the Firebase SDK as needed (e.g., `firebase/firestore`, `firebase/app`) using `vi.mock` to ensure tests run in isolation without hitting actual Firebase services.
- Write unit tests for at least one or two functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`). Focus on the core logic and interaction with mocked Firestore methods.
- Ensure all tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
