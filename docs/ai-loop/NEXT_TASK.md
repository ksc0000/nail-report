# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for `src/lib/firestore.ts` helper functions using Vitest. This task focuses on implementing the first set of these tests.

## Objective

Implement Vitest unit tests for the `addItem` helper function located in `src/lib/firestore.ts`. This involves creating a new test file and mocking the necessary Firebase SDK methods to ensure isolated testing of `addItem`'s logic.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to modify core logic).
- `src/__tests__/firestore.test.ts` (new file for tests).
- `vite.config.ts` (only for adding Vitest configuration if strictly necessary and it's missing, but prioritize writing tests).
- `package.json` (only for adding or modifying `test` scripts if Vitest setup is incomplete, but **no new npm dependencies**).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope".

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for the `addItem` function in `src/lib/firestore.ts`.
- Ensure the Firebase SDK calls (e.g., `addDoc`, `collection`) are properly mocked using `vitest` and `vi.mock` to prevent actual Firebase interactions.
- Test cases should cover successful item addition and potential error scenarios if `addItem` handles them.
- Keep the diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and report any issues.
- Do not add new npm dependencies to `package.json`. Assume `vitest` is already installed as a `devDependency`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
