# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, which involves improving stability, test coverage, and UX. This task specifically targets enhancing test coverage for core helper functions.

## Objective

Add Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting non-exported helpers if necessary for direct testing, but prioritize mocking dependencies).
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`).
- `src/App.css` (not applicable for this task).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify).
- `commands/` (PowerShell scripts — do not modify).
- `firestore.rules`, `storage.rules` (require human approval).
- `package.json` deps (no new npm packages without human approval).
- Firebase deploy commands.
- Secrets and credentials.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing at least one or two key functions in `src/lib/firestore.ts` (e.g., a function for adding a new item, fetching items, or updating an item).
- Use `vitest` for testing and `vi.mock` to mock Firebase SDK dependencies (Firestore instances, collection/document references, etc.) to ensure tests are isolated and run without actual Firebase calls.
- Avoid introducing any new `npm` package dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
