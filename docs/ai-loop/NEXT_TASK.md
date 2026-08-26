# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for core helper functions.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (minor additions for Vitest setup, if absolutely necessary, but assume Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for `addNailItem` and `getNailItems` functions from `src/lib/firestore.ts`.
- Mock the Firebase SDK functions (`collection`, `addDoc`, `getDocs`, etc.) as needed for isolated unit testing. Do not connect to a real Firebase project.
- Ensure `npm run test` passes after adding the tests.
- Run `npm run build && npm run lint` before finishing and ensure no errors.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
