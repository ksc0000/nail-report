# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key part of this is adding comprehensive unit tests. Your current objective is to kick off the test coverage initiative by targeting core Firebase helper functions.

## Objective

Add unit tests for helper functions located in `src/lib/firestore.ts`. This task focuses on implementing initial test coverage for a few key functions in this module using Vitest, including setting up necessary Firebase SDK mocks.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to the original logic)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions if Vitest setup for mocking is not complete, but should generally be ready)

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
- Create at least one new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItemsForUser`).
- Use `vitest` and mock Firebase SDK dependencies as needed (e.g., `firebase/firestore`).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
