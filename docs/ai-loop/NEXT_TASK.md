```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the core Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor refactoring to improve testability, but primary changes should be in tests)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vite.config.ts` (if minor Vitest configuration is required, e.g., to define globals for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do not add new npm packages unless Vitest is missing and explicitly needed for this task, which is implicitly approved by the roadmap)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, and other UI components

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure Vitest is correctly configured and working for the project.
- Mock the Firebase Firestore SDK (e.g., using `vi.mock('firebase/firestore')`) to isolate tests from actual Firebase calls.
- Write unit tests for at least two core CRUD helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, or `getNailItems`).
- Tests should cover successful execution paths for the selected functions.
- Place new test files in `src/__tests__/lib/` directory.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your primary task is to write unit tests for the Firebase Firestore helper functions within `src/lib/firestore.ts`.

1.  **Set up Testing Environment (if necessary):** Confirm Vitest is installed and configured. If `vitest` is not already a dev dependency in `package.json`, install it: `npm install -D vitest`. Configure `vite.config.ts` if needed to integrate Vitest and set up global mocks.
2.  **Identify Core Functions:** Examine `src/lib/firestore.ts` and identify key functions responsible for interacting with the `nailItems` collection (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, or a function that fetches a list of items).
3.  **Create Test File:** Create a new test file: `src/__tests__/lib/firestore.test.ts`.
4.  **Mock Firebase Firestore SDK:** Within your test file, use `vi.mock('firebase/firestore')` to mock the Firebase Firestore SDK. This will prevent actual calls to Firebase during tests. You will need to mock functions like `doc`, `collection`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, and `getDocs` as necessary for the functions you are testing.
5.  **Write Unit Tests:**
    *   Choose at least two of the identified core CRUD functions from `src/lib/firestore.ts`.
    *   Write `describe` blocks and `it` or `test` cases for these functions.
    *   Focus on testing the logic within your `firestore.ts` helpers, ensuring they correctly call the mocked Firebase functions with the expected arguments and handle their responses.
    *   Ensure tests cover successful scenarios.
6.  **Run Tests:** Execute tests using `npm test` (or `vitest`). Ensure all new tests pass.
7.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

Remember to keep the PR small and focused, targeting a diff of under 150 lines. If testing all functions makes the diff too large, prioritize 2-3 key CRUD operations.
```
