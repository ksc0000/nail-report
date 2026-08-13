# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is active, with a focus on improving stability, test coverage, and UX. The current task is to begin addressing the "2.1 Test coverage" goal by adding unit tests for key Firebase-related helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem`, `updateNailItem`, and `deleteNailItem` functions located in `src/lib/firestore.ts`. This involves setting up Firebase SDK mocking to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for adding or configuring Vitest if not already fully set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Mock the Firebase Firestore SDK using `vi.mock` to prevent actual database calls during tests. Focus on mocking `doc`, `collection`, `setDoc`, `updateDoc`, `deleteDoc` as needed.
- Ensure tests cover basic success cases for each function.
- Keep the overall diff for this task to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and report any issues.
- Report any follow-up items (e.g., missing mocks for error handling, or tests for other functions) as comments in the PR, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
