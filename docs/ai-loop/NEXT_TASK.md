```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firestore helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts`. The focus should be on demonstrating how to mock Firebase SDK interactions for testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding `test` script, no new dependencies)
- `vite.config.ts` (if minor Vitest configuration is needed, e.g., for aliasing or environment setup)

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
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or similar data interaction functions).
- Ensure Firebase SDK calls are properly mocked using `vitest`'s mocking capabilities.
- The tests should verify the logic and correct interactions with the mocked Firebase services.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains tests for at least two functions from `src/lib/firestore.ts`.
- Firebase SDK functions are mocked correctly to allow isolated testing of `firestore.ts` logic.
- All new tests pass when `npm run test` is executed.
- `npm run build` and `npm run lint` pass without errors or warnings.

## Required Test Commands

```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm run test # Ensure all new tests pass
```
```
