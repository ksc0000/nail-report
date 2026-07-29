# Worker Prompt Template

## Context

Phase 2 of the roadmap is active, focusing on improving stability, test coverage, and UX. This task initiates the "2.1 Test coverage" goal by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering basic CRUD operations (add, get, update, delete) and their respective success and failure paths by mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if needed for testability, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if absolutely necessary for test setup, unlikely for this task)
- `package.json` (only to add `vitest` scripts if not already present, but the roadmap implies Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval beyond Vitest if not configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK calls using `vi.mock` to ensure tests are isolated and don't interact with a live Firebase project.
- Cover at least basic success and error cases for functions like `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
