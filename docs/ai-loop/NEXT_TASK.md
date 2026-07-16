# Worker Prompt Template

## Context

The current roadmap prioritizes improving stability and test coverage in Phase 2.1. This task focuses on adding unit tests for existing helper functions to increase code robustness.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically mocking the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if strictly necessary, e.g., exporting unexported functions, but prefer not to modify logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a `test` script or `devDependencies` already listed as present, e.g., Vitest is expected to be configured)
- `vite.config.ts` (if minor Vitest configuration for mocking is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages that are not already present or explicitly allowed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two core functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, getting, updating, or deleting `nailItems`).
- Mock the Firebase SDK (Firestore specifically) using Vitest's `vi.mock` to ensure tests run in isolation without actual Firebase calls.
- Ensure the tests cover both successful operations and potential error scenarios where applicable.
- Keep the diff for this change under 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
