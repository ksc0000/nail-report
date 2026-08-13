# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests to a critical Firebase helper file.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`, ensuring Firebase SDK mocking is utilized as outlined in the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on the test file)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `package.json` (only if Vitest or its core dependencies are *not* already present for testing and their addition is absolutely required to run tests, though the assumption is Vitest is already set up as per roadmap. *Prioritize using existing setup.*)
- `vite.config.ts` (if minor configuration is needed for Vitest)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (unless strictly necessary for Vitest setup AND it's not already installed, otherwise no *new* npm packages beyond the existing test runner infrastructure)
- Firebase deploy commands
- Secrets and credentials
- Any files not explicitly listed in "Allowed Scope"

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the functions within `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
- Use Vitest as the test runner.
- Mock Firebase SDK dependencies (Firestore, Auth, Storage) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure the tests cover basic CRUD operations and error paths for the `firestore.ts` functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
