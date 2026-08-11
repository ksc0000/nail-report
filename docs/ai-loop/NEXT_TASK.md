# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by targeting core Firebase interaction helpers. `Vitest` is the designated test runner for the project.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (minor adjustments if needed to correctly configure test paths, but avoid adding new dependencies)

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
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.
- Utilize `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate the `firestore.ts` functions for testing.
- Ensure all newly added tests pass successfully.
- Do not add any new npm dependencies to `package.json`. Assume Vitest is already installed or properly configured for running tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
