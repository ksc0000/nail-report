```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or adding test utilities)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest if necessary, but Vitest is already mentioned as the test runner in the roadmap)

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
- Create `src/__tests__/firestore.test.ts` to house the new tests.
- Add unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- The tests should mock Firebase SDK dependencies as needed, using `vitest` and `vi.mock`.
- Ensure tests run correctly with `npm test`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Hey Jules,

Your next task is to begin implementing unit tests for the Firebase helper functions. Start by focusing on the functions within `src/lib/firestore.ts`.

1.  **Create Test File:** Create a new test file at `src/__tests__/firestore.test.ts`.
2.  **Add Vitest Configuration (if needed):** Ensure Vitest is correctly set up to run tests in this directory. If `vitest` is not already configured in `package.json` scripts, add `test: vitest`.
3.  **Implement Mocks:** Use `vitest`'s mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK, preventing actual database calls during tests. Focus on mocking the methods that `src/lib/firestore.ts` uses (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
4.  **Write Unit Tests:** Write unit tests for at least two key functions in `src/lib/firestore.ts`. For example:
    *   `addNailItem`: Test successful addition.
    *   `getNailItems`: Test successful retrieval of a list of items.
    *   `updateNailItem`: Test successful update of an item.
    *   `deleteNailItem`: Test successful deletion of an item.
    *   Aim for basic success cases and ensure the helper functions interact with the mocked Firebase methods as expected.
5.  **Run Tests:** Execute `npm test` and verify that your new tests pass.
6.  **Lint and Build:** Run `npm run build && npm run lint` to ensure no new errors are introduced.

Focus on making these tests simple, clear, and focused on the logic within `src/lib/firestore.ts` itself, not the Firebase SDK. This will lay the groundwork for more comprehensive testing.
```
