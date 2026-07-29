```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to increase test coverage for critical helper functions. This task initiates the process by adding unit tests for a core Firestore helper.

## Objective

Implement Vitest unit tests for the `addNailItem` helper function located in `src/lib/firestore.ts`. This involves creating a new test file and mocking the necessary Firebase SDK functions to enable isolated testing.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability, if strictly necessary, but prefer not to modify)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration or global mocks are needed for Firebase SDK, but aim to keep mocks local to the test file if possible for a smaller diff)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be configured)
- Firebase deploy commands
- Secrets and credentials
- Modifying `src/App.tsx` or other UI components.

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for the `addNailItem` function in `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK functions (`addDoc`, `collection`) using `vi.mock` to ensure tests run in isolation without connecting to actual Firebase services.
- Assert that `addNailItem` correctly calls the mocked Firebase functions with the expected arguments and returns the expected result.
- Keep the diff concise, aiming for ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure the tests pass by running `npm run test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
