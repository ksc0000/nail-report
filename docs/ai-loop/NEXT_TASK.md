# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage. Phase 2.1 specifically targets unit tests for Firestore helper functions. This task focuses on initiating that effort by adding Vitest and basic tests for `src/lib/firestore.ts`.

## Objective

Add Vitest setup and initial unit tests for helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to configure Vitest)
- `package.json` (to add Vitest scripts)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except adding Vitest as a dev dependency if not already present. If Vitest is not a dev dependency, report as a follow-up item after confirming if adding it is allowed, but do not add it yourself.)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK as necessary using `vi.mock` to isolate the Firestore helper functions.
- Implement tests for at least one or two simple `firestore.ts` helper functions (e.g., `getNailItems`, `addNailItem`).
- Ensure tests run successfully using `npm test` (or `npm run test` if `test` is not the default script).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to implement the first step towards adding unit test coverage for `src/lib/firestore.ts`.

1.  **Vitest Setup**:
    *   Ensure Vitest is correctly configured in `vite.config.ts`. If `vitest` is not present in `devDependencies` in `package.json`, report this as a limitation but proceed with the assumption it will be available.
    *   Add or update a test script in `package.json` to run Vitest (e.g., `"test": "vitest"`).

2.  **Create Test File**:
    *   Create a new test file at `src/__tests__/firestore.test.ts`.

3.  **Mock Firebase SDK**:
    *   Implement mocking for the Firebase SDK using `vi.mock` to simulate Firestore interactions without actually hitting the database. You'll likely need to mock `firebase/firestore`. Focus on mocking the specific Firestore methods that the `firestore.ts` helpers use (e.g., `collection`, `getDocs`, `addDoc`).

4.  **Implement Unit Tests**:
    *   Write unit tests for at least one or two simple functions within `src/lib/firestore.ts`. Good candidates to start with are `getNailItems` or `addNailItem`, as they involve basic read/write operations.
    *   Ensure your tests verify the expected behavior and return values of these functions.

5.  **Run Tests**:
    *   Execute the new tests to confirm they pass.

6.  **Lint and Build**:
    *   Run `npm run build` and `npm run lint` to ensure no errors are introduced.

Keep the changes concise and focused to stay within the diff size limit. If mocking the entire Firebase SDK for `firestore.ts` proves too complex for a single PR, prioritize mocking just the necessary parts for the chosen functions, and note the remaining mocking as a follow-up.
