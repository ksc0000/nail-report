```markdown
# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" objective by implementing unit tests for core Firebase Firestore helper functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on testing a few simple, pure functions first to establish the testing pattern for this module.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions if Vitest setup is incomplete, e.g., enabling global mocks or environment setup)
- `package.json` (read-only for verifying existing dev dependencies like `vitest`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (do NOT add new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, `src/components/` (not relevant for this task)
- Any other files not explicitly mentioned in "Allowed Scope"

## Requirements

- Keep the diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two simple helper functions in `src/lib/firestore.ts` (e.g., `createNailItemData`, `updateNailItemData`).
- Use Vitest for testing and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure tests are isolated and do not interact with a live Firebase project.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed (e.g., "Added unit tests for `createNailItemData` and `updateNailItemData` in `src/lib/firestore.ts`.")
- Changed files list (e.g., `src/lib/firestore.ts`, `src/__tests__/firestore.test.ts`)
- Commands run and results (e.g., `npm test` output, `npm run lint` output)
- Known issues or limitations (e.g., "Only basic functions are covered; more comprehensive testing is needed.")
- Suggested next task (e.g., "Expand unit test coverage for other functions in `src/lib/firestore.ts`.")
```
