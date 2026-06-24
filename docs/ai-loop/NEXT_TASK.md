```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task will contribute to the "2.1 Test coverage" goal by adding unit tests for a core Firebase helper file.

## Objective

Implement Vitest unit tests for the functions within `src/lib/firestore.ts`. This involves setting up mocks for Firebase Firestore SDK methods as needed to isolate the functions under test.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
-   `src/__tests__/` (creation of `src/__tests__/firestore.test.ts` or similar for tests)
-   `package.json` (only if adding a new script for tests, but *not* new dependencies)
-   `vite.config.ts` (if Vitest configuration is needed, but prefer existing setup)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   `package.json` deps (no new npm packages)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files not explicitly in "Allowed Scope"

## Requirements

-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Write unit tests for the helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShares`, etc.).
-   Use `vitest` and `vi.mock` to mock the Firebase Firestore SDK to ensure tests are isolated and do not interact with a live database.
-   Ensure tests cover typical successful execution paths and basic error handling where applicable within the `firestore.ts` functions.
-   Keep the total diff for the PR under 150 lines.
-   Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

```
