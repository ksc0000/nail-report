# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task focuses on improving test coverage by adding unit tests for core helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only for adding a Vitest script, no new npm dependencies)
- `vite.config.ts` (only for Vitest configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `package.json` and `vite.config.ts` if strictly necessary for Vitest setup.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two helper functions found in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vitest.mock` to ensure tests are isolated unit tests, not integration tests.
- Ensure all tests pass (`npm test`).
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
