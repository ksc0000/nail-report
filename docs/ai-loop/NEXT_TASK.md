# Worker Prompt Template

## Context

The application is in Phase 2, focusing on stability, test coverage, and UX improvements. The current task is to begin adding unit test coverage for core Firebase helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts`, specifically focusing on `addNailItem` and/or `getNailItems`, utilizing Vitest and mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if Vitest or a mocking library needs to be added as an *existing* dev dependency, otherwise no changes)
- `vite.config.ts` (if Vitest configuration is not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval; only update if *existing* ones are needed, e.g., Vitest is likely already present as per roadmap)
- Firebase deploy commands
- Secrets and credentials
- Any files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one of `addNailItem` or `getNailItems` from `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover basic success cases for the chosen function(s).
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
