# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task will contribute to test coverage.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts`. This involves creating a new test file and mocking the Firebase SDK to isolate the functions for testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability, but primarily for understanding what to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup for mocks is required, but prefer to configure mocks within the test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` (if it doesn't exist).
- Write unit tests for at least `addNailItem` and `getNailItems` from `src/lib/firestore.ts`.
- Ensure Firebase SDK calls (e.g., `doc`, `collection`, `addDoc`, `getDocs`) are properly mocked using `vi.mock` to prevent actual Firebase interactions.
- Use `vitest` for the tests.
- Run `npm run test` and ensure new tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
