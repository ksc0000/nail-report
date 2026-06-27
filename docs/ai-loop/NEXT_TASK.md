# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The current state indicates that initial setup tasks are complete, and we are ready for the first substantive coding task.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This task aims to improve test coverage as outlined in Phase 2.1 of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding functions to test)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/` (any other necessary files within `src/` for test setup/mocking if absolutely required, but prioritize `src/__tests__/`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for the helper functions within `src/lib/firestore.ts`.
- Use Vitest as the test runner and mocking utilities where necessary (e.g., `vi.mock` for Firebase SDK).
- Ensure basic CRUD operations (add, get, update, delete) handled by `firestore.ts` are covered.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
