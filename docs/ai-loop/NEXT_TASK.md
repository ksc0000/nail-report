# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2.1 focuses on increasing test coverage, and this task addresses testing core library functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering the main CRUD operations (e.g., adding, getting, updating, deleting nail items) and any other utility functions exposed or used by `firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications, e.g., exporting a previously non-exported helper function for testability, but avoid changing core logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if absolutely necessary for Firebase SDK mocking setup; prefer not to modify)

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
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) as needed using `vi.mock` to isolate `firestore.ts` logic.
- Ensure the new tests can run successfully using `npm run test`.
- Aim for good test coverage of the functions within `src/lib/firestore.ts`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
