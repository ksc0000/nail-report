# Worker Prompt Template

## Context

The current phase (Phase 2) of the roadmap prioritizes improving stability, test coverage, and UX. Adding unit tests for core helper functions is a critical first step in enhancing stability and ensuring correctness. The test runner for the project is Vitest.

## Objective

Implement unit tests for two key Firestore helper functions, `createNailItem` and `deleteNailItem`, located in `src/lib/firestore.ts` using Vitest. This task aims to establish initial test coverage for the Firestore module.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions or small refactors if necessary for testing)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `src/App.css` (only if absolutely necessary for test setup/mocks, which is unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for `createNailItem` and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` as required by Vitest to isolate the functions under test.
- Ensure tests cover successful operations and basic error handling scenarios.
- Keep the overall diff of the PR to a maximum of 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- All new tests must pass (`npm test`).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
