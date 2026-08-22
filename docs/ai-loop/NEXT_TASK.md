# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add testable exports if necessary, but prefer not to alter production code solely for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor modifications for test setup if absolutely required for Vitest, but Vitest should already be configured as per roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related CSS files
- Any files outside of `src/lib/firestore.ts`, `src/__tests__/`, and potentially `vite.config.ts`.

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`).
- Ensure Firebase SDK calls are mocked using `vi.mock` to prevent actual network requests during tests.
- Aim for good test coverage for the selected functions.
- Keep diff ≤ 150 lines.
- Run `npm run test` (to confirm tests pass) and `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
