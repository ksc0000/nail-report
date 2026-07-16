# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" objective by adding unit tests to a critical Firebase helper file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This includes setting up Vitest if it's not already configured, and writing comprehensive tests that mock Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability, e.g., exporting functions, but prioritize mocking)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (minimal configuration for Vitest setup, if necessary)
- `package.json` (to add/modify test script, but *no new npm dependencies*)
- `package-lock.json` (to reflect changes in `package.json` if any)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- **Create a new test file:** `src/__tests__/firestore.test.ts`.
- **Implement unit tests for `src/lib/firestore.ts`:**
    - Focus on core CRUD operations, specifically `addNailItem`, `updateNailItem`, `deleteNailItem`.
    - Mock Firebase SDK dependencies (e.g., `firestore`, `doc`, `collection`, `addDoc`, `updateDoc`, `deleteDoc`) using `vitest`'s mocking capabilities (`vi.mock`).
    - Ensure tests cover successful operations and potential error scenarios if easily mockable.
- **Configure Vitest:** If `vitest` is not already configured in `vite.config.ts`, add the minimal necessary setup to enable running tests. If a `test` script is missing in `package.json`, add `vitest` as the command.
- **Maintain code quality:** Ensure `npm run build && npm run lint` pass without errors.
- **Keep diff small:** The total line changes (additions, deletions, modifications) must be ≤ 150 lines.
- **Avoid new npm dependencies:** Do not add any new packages to `package.json`'s `dependencies` or `devDependencies`. Vitest is considered part of the testing infrastructure already in scope for Phase 2.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
