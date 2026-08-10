# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by targeting core Firebase helper functions. Vitest is already configured as the test runner.

## Objective

Add unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if essential for Vitest configuration, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`, to house the tests.
- Focus on mocking Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `setDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated and fast.
- Test at least two or more of the existing helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
