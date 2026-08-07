# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on stability, test coverage, and UX. The current state indicates that no substantive task has been completed yet from this phase, making test coverage a foundational next step.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`. This task aims to improve test coverage as outlined in Phase 2.1 of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a `test` script if not present, do not add new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Add a new test file `src/__tests__/firestore.test.ts`.
- Focus on testing the core helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Utilize `vi.mock` to mock Firebase Firestore SDK interactions.
- Ensure tests cover successful operations and basic error handling where applicable for the `firestore.ts` functions.
- If `package.json` does not have a `test` script for Vitest, add one (e.g., `"test": "vitest"`). Do not add `vitest` as a new dependency if it's not already present; assume it's a dev dependency to be used.
- Keep the diff ≤ 150 lines. Focus on a good initial set of tests for a few key functions.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
