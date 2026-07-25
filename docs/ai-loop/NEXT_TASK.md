# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically mocking the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes if needed to make functions testable, but prefer to keep logic separate)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor config changes are required for mocking, unlikely)

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
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Write unit tests for the primary CRUD helper functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Ensure tests cover both successful operations and simulate potential Firestore errors.
- Aim for good coverage of the core logic in these `firestore.ts` helper functions.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
