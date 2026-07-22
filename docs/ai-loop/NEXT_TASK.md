# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core Firebase helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, with a focus on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` or `@vitest/coverage-v8` need to be explicitly added as dev dependencies and are not present, though the roadmap implies Vitest is set up. **Prioritize confirming setup over adding new deps.** If not present, report as a follow-up, do *not* add without explicit approval.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, unless specifically for Vitest setup if found missing. Confirm first.)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Focus on testing at least two core CRUD operations (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) from `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate the `firestore.ts` logic.
- Ensure tests run successfully with `npm run test` or `vitest`.
- Run `npm run build && npm run lint` before finishing.
- Report any necessary Vitest setup (if it appears to be missing) as a follow-up item.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
