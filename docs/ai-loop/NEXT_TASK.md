# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for reading and understanding existing functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for checking existing Vitest setup, no new dependencies)
- `vite.config.ts` (only for checking existing Vitest setup, no modifications needed for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any CSS files (`src/App.css`, etc.)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Identify and select at least two key functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding/getting/updating nail items or public shares).
- Write unit tests for the selected functions.
- Mock the Firebase Firestore SDK methods using `vi.mock` to isolate the logic of the helper functions from actual Firebase calls.
- Cover both successful execution paths and error handling paths for the tested functions.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
