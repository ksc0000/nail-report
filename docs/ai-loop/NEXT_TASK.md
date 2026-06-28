# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. The first sub-phase, "2.1 Test coverage", aims to add unit tests for Firebase helper functions. This task specifically targets the core Firestore utility functions to improve their robustness and ensure future changes don't introduce regressions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, with a focus on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is strictly necessary for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related CSS files
- Any files not directly related to Firestore helpers or their tests

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least one core helper function in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, or `getNailItems`).
- Effectively mock Firebase SDK calls (e.g., `doc`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to isolate the logic being tested from actual Firebase interactions.
- Ensure test cases cover successful operations and potential error scenarios.
- Keep the overall diff of the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` and `npm run test` before finishing. All tests must pass, and the build and lint checks must be clean.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
