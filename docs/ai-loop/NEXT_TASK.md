# Worker Prompt Template

## Context

The current phase of development focuses on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal by adding unit tests for a core Firebase helper file.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. Focus on covering the main CRUD operations and utility functions exposed by this module.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if needed to facilitate testing, e.g., exporting unexported functions if appropriate for testing, but prioritize testing existing public exports)
- `src/__tests__/` (add a new test file, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, unlikely but allowed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
- Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Focus on testing the public-facing functions in `src/lib/firestore.ts` with mock data.
- Ensure tests are robust and cover typical use cases (e.g., successful data retrieval, addition, update, deletion, error handling scenarios if applicable to the function's responsibility).
- Run `npm test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
