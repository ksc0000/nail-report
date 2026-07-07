# Worker Prompt Template

## Context

The roadmap emphasizes improving stability and test coverage in Phase 2.1. The current state shows no unit tests for the core `src/lib` helper functions. This task focuses on establishing initial test coverage for Firestore interactions.

## Objective

Implement unit tests for `src/lib/firestore.ts` helper functions, specifically focusing on `addNailItem` and `getNailItems`, utilizing Vitest and appropriate mocking of the Firebase SDK (Firestore).

## Allowed Scope

- `src/lib/firestore.ts` (for inspection and understanding, no functional code changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but unlikely)
- Existing testing utilities or setup files within `src/` that aid in Firebase mocking.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`.
- Ensure Firebase SDK (Firestore) dependencies are properly mocked using `vi.mock` to isolate the functions under test.
- The tests should verify successful operations and ideally basic error handling for these specific functions.
- Keep the overall diff of the PR to ≤ 150 lines.
- Run `npm run test` to verify the new tests pass.
- Also, run `npm run build && npm run lint` before finishing to ensure code quality and project integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
