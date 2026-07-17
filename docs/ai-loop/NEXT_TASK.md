# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task specifically addresses the test coverage goal by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/setupTests.ts` (if needed for global Vitest setup, but prefer local mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement at least two unit tests for distinct functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK calls are properly mocked using `vitest` and `vi.mock` to isolate the `firestore.ts` logic.
- The tests should run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least two passing unit tests for functions in `src/lib/firestore.ts`.
- The tests correctly mock Firebase Firestore SDK interactions.
- `npm test` runs successfully, and the new tests pass.
- The PR diff is within the specified line limit.
