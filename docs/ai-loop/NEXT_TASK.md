# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key area identified for improvement is test coverage for core helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This involves creating a new test file, setting up Firebase Firestore mocks, and writing test cases to verify the functionality of the helpers.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary for mocks, e.g., glob patterns, but prefer direct `vi.mock` in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying `src/App.css`

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest (`@vitest/runner`, `@vitest/coverage-v8` should be available) for writing tests.
- Mock Firebase Firestore SDK calls (`firebase/firestore`) using `vi.mock` to prevent actual calls to Firebase during tests.
- Write at least one unit test case for each of the main CRUD-related helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`).
- Ensure tests verify successful data operations and basic error scenarios where applicable for the specific function being tested.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
