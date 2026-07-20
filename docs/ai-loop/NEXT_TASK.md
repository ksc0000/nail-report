# Worker Prompt Template

## Context

The roadmap outlines phases for improving the `nail-report` application. Phase 2 focuses on stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments needed to facilitate testing, though primarily testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/App.css` (No changes expected, but allowed if strictly necessary for testing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `getNailItems` and `addNailItem`.
- Mock Firebase SDK dependencies using Vitest's `vi.mock` to ensure tests are isolated and do not hit actual Firebase services.
- Ensure the tests cover basic functionality and edge cases (e.g., empty data, error scenarios if easily mockable).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
