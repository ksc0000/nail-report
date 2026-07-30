```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2.1. Your current task is to contribute to this by adding unit tests for our Firebase Firestore helper functions. Vitest is already set up for this project.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on a creation or retrieval function to demonstrate mocking Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding functions to test, minor refactoring to improve testability is permitted if necessary, but avoid significant logic changes)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `src/__tests__/` (any other new test files related to firestore helpers)
- `src/test-setup.ts` (if required for global test mocks, but try to keep mocks local to the test file if possible for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `vite.config.ts` (no changes to Vitest configuration)
- `src/App.tsx`, `src/App.css` (UI changes are not part of this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file (e.g., `src/__tests__/lib/firestore.test.ts`).
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) as needed to isolate `firestore.ts` functions.
- Write unit tests for at least one core helper function in `src/lib/firestore.ts`, such as `addNailItem` or `getNailItems`, covering typical success and error scenarios. Focus on demonstrating effective mocking and assertion.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
