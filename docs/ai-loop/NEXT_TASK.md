# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, if strictly necessary and within diff limits)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files, if deemed appropriate for better organization)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one to two key helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Use `vitest` and `vi.mock` to effectively mock Firebase SDK dependencies (Firestore instances, authentication state) to isolate the functions under test.
- Ensure the tests cover basic functionality and expected outcomes.
- Keep diff ≤ 150 lines. Focus on testing a small, core part of the file.
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build errors.
- Report any follow-up items as comments.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
