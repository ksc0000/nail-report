# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The current task is to improve test coverage for core library functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to ensure true unit tests for the functions themselves.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but avoid major refactors)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer existing setup)

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
- Run `npm test` and ensure all newly added tests pass.
- Focus on testing the functions in `src/lib/firestore.ts` such as `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.
- Mock the Firebase Firestore SDK using `vi.mock` to isolate tests from actual Firebase calls.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
