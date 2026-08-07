# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets the "Test coverage" objective (2.1). The application uses Firebase Firestore, and its interactions are encapsulated in `src/lib/firestore.ts`. Vitest is the designated test runner.

## Objective

Implement unit tests for *two* helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on demonstrating how to mock Firebase Firestore interactions to enable isolated testing of these helper functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported helpers)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume basic setup exists)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` (no new npm packages, `devDependencies` or `dependencies` entries without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two Firestore helper functions from `src/lib/firestore.ts`. Good candidates are `addNailItem` and `deleteNailItem`.
- Mock Firebase Firestore SDK dependencies (e.g., `firebase/firestore`) to ensure tests are isolated and do not interact with a live Firebase project.
- Ensure the tests cover basic functionality and error handling for the chosen functions where applicable.
- Keep the overall diff for the PR within approximately 150 lines.
- Run `npm run build && npm run lint && npm test` successfully before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
