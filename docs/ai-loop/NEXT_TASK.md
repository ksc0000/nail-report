# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task initiates the test coverage efforts by setting up a testing framework and writing initial unit tests.

## Objective

Set up Vitest for unit testing (if not already configured) and add unit tests for core Firestore helper functions related to `nailItems` in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactoring)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `package.json` (to add `vitest` as a `devDependency` if missing; this is an exception to the `no-new-npm-deps` constraint, as Vitest is explicitly on the roadmap)
- `vite.config.ts` (for Vitest configuration)
- `src/` (new files for test utilities or mocks if necessary for Vitest setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages other than `vitest` for setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- **Ensure Vitest Setup**: If Vitest is not already configured, install it as a `devDependency` and set up the basic configuration in `vite.config.ts`.
- **Create Test File**: Create `src/__tests__/firestore.test.ts`.
- **Implement Unit Tests**: Add unit tests for the following functions in `src/lib/firestore.ts`, ensuring Firebase Firestore SDK calls are properly mocked:
    - `addNailItem`
    - `getNailItems`
    - `updateNailItem`
    - `deleteNailItem`
- **Mocking**: Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Keep diff ≤ 150 lines. Prioritize Vitest setup and testing `addNailItem` and `getNailItems` if the line limit is approached.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
