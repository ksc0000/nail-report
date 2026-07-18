# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX. This task initiates the test coverage efforts by setting up Vitest and writing the first unit tests for the Firebase helper functions.

## Objective

Configure Vitest for the project (if not already fully configured) and add a unit test file for `src/lib/firestore.ts`, including at least one test case for a helper function within that file.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts`
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration)
- `package.json` (for adding Vitest scripts, but NO new `dependencies` or `devDependencies` if Vitest is already declared)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval; if Vitest is not in `devDependencies`, report it as an issue, but do not add it)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Ensure Vitest is configured correctly and runnable.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write at least one unit test for a function exported from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, etc.).
- The test should mock Firebase SDK dependencies using `vi.mock` as appropriate to achieve true unit testing.
- Keep diff ≤ 150 lines.
- Run `npm run test` (or equivalent Vitest command) to confirm tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report any necessary `devDependencies` additions (e.g., `vitest`, `@vitest/coverage-v8`) in "Known issues or limitations" if they are not already present.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
