# Worker Prompt Template

## Context

The application is in Phase 2, focusing on stability, test coverage, and UX improvements. The current task is to begin adding unit test coverage to core helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with the Firebase Firestore database, and ensuring their reliability is a high priority.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on testing the logic of these functions in isolation, mocking Firebase SDK calls as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (No changes expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`. Examples include functions for fetching or adding nail items, or any other well-defined helper.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure the tests cover basic success cases and plausible error scenarios where applicable.
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
