```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task addresses the "Test coverage" aspect by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary, but prefer to keep changes minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for adding Vitest setup if not already configured for test files)

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
- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least one, preferably two, functions from `src/lib/firestore.ts`, such as `addNailItem` or `getNailItems`.
- Use `vi.mock` to mock Firebase Firestore SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`).
- Ensure the tests are isolated and do not make actual calls to Firebase.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
## Worker prompt

You are tasked with enhancing the test coverage for the `nail-report` application by adding unit tests for Firestore helper functions.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Vitest Setup**: Ensure Vitest is correctly configured to run tests within `src/__tests__/`. If `vite.config.ts` needs a minor adjustment to include test files (e.g., `test: { include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'] }`), apply it.
3.  **Mock Firebase Firestore SDK**: Before importing `src/lib/firestore.ts`, use `vi.mock` to mock the necessary Firebase Firestore SDK functions and objects that `firestore.ts` depends on. This includes mocking `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, and any other Firestore-related functions called within `src/lib/firestore.ts` that you plan to test.
4.  **Implement Tests**: Write unit tests for one or two of the simpler functions in `src/lib/firestore.ts`. Good candidates are `addNailItem` and `getNailItems`.
    *   For `addNailItem`, test that `addDoc` is called with the correct arguments (Firestore instance, collection ref, data).
    *   For `getNailItems`, test that `collection`, `query`, and `getDocs` are called correctly and that the function processes and returns the mock snapshot data as expected.
5.  **Run Tests**: Execute `npm test` to ensure your new tests pass.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to verify no linting issues or build errors are introduced.

Remember to keep the changes concise and focused on testing specific functions with proper mocking.
```
