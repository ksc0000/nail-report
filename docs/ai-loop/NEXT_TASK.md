# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, which focuses on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets increasing test coverage for helper functions. This task is the first step in addressing test coverage for core Firebase-related utility functions in `src/lib/`. Vitest is specified as the test runner in the roadmap and is expected to be already installed and configured.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`. This involves setting up mocks for the Firebase SDK's Firestore methods as required to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor, minimal changes for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding/modifying a `test` script if not already present, *not* for adding new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Ensure tests effectively mock Firebase SDK Firestore functions such as `addDoc`, `collection`, `getDocs`, `query`, and `where` as relevant for `addNailItem` and `getNailItems`.
- Write clear, isolated unit tests that cover successful operations and relevant error paths for both functions.
- Run `npm run build && npm run lint && npm run test` before finishing and confirm all tests pass.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
