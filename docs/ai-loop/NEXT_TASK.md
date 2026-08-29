# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, UX, accessibility, and mobile experience. The current state shows that this is the first substantive task being tackled for Phase 2.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This directly addresses "2.1 Test coverage" from the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for minor Vitest configuration, if strictly necessary for mocking, but prefer to mock within the test file)

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
- Create a new test file, `src/__tests__/firestore.test.ts`, to house the tests.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) as necessary using `vi.mock` to ensure tests are isolated and run without actual Firebase calls.
- Write tests for at least two helper functions in `src/lib/firestore.ts`. Focus on their core logic rather than their interaction with the live Firebase service.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
