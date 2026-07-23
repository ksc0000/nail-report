# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product is in Phase 2, focusing on stability, test coverage, and UX improvements. This task focuses on improving test coverage for core utility functions.

## Objective

Implement unit tests for the `addItem` and `getAllItems` functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor modifications for Vitest setup, if strictly necessary, but Vitest is expected to be largely configured already)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `Allowed Scope` not explicitly mentioned.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore and Auth) using `vi.mock` as needed to isolate `firestore.ts` functions.
- Write at least one test case for `addItem` (e.g., successful addition).
- Write at least one test case for `getAllItems` (e.g., successful retrieval of multiple items).
- Tests should assert correct function behavior and interaction with mocked Firebase services.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
