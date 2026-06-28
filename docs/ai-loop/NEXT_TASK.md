# Worker Prompt Template

## Context

The product roadmap outlines Phase 2: "Improve stability, test coverage, and UX." The current state shows that no specific feature tasks are in progress, allowing us to pick the next bounded task. The first task in Phase 2 focuses on improving test coverage.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few key, independent functions to keep the PR small.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__mocks__/firebase.ts` (new file for mocking Firebase SDK, if necessary)
- `package.json` (only if necessary to add `test` script; no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two independent helper functions in `src/lib/firestore.ts`. Examples include `addNailItem` or `getNailItems`.
- Mock Firebase SDK dependencies as needed using `vitest`'s mocking capabilities.
- Ensure the tests can run successfully with `npm run test`.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items (e.g., remaining functions to test) as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
