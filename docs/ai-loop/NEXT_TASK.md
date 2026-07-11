# Worker Prompt Template

## Context

The current phase of development focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by targeting core utility functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to export functions if necessary for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (minor configuration if strictly required for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least 2-3 helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Focus on mocking Firebase SDK interactions (Firestore, Firebase App) using `vitest` and `vi.mock` as outlined in the roadmap.
- Ensure tests cover both successful execution paths and error scenarios.
- Keep the overall diff for this task ≤ 150 lines.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
