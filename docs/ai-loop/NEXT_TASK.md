# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest. This aligns with Phase 2.1 (Test coverage) of the roadmap. Focus on a few core CRUD functions like `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to export functions if needed for testing, but prioritize minimal changes to existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration needs adjustment for test file discovery or mocking, but try to avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory except explicitly allowed.

## Requirements

- Keep diff ≤ 150 lines.
- Mock Firebase SDK dependencies as needed (e.g., `firebase/firestore`). Refer to existing Vitest setup for mocking examples if available.
- Ensure the tests are isolated and do not interact with actual Firebase services.
- Run `npm run build && npm run lint && npm test` before finishing. All tests must pass.
- Report follow-up items (e.g., more functions to test, edge cases) as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
