```markdown
# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" objective by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the functions defined in `src/lib/firestore.ts` using Vitest, including mocking the Firebase SDK as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/App.css` (no changes expected)
- `package.json` (only if adding `vitest` scripts or config, but not new dependencies)
- `vite.config.ts` (if Vitest configuration is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests covering the main public functions in `src/lib/firestore.ts` (e.g., functions related to `nailItems`, `tags`, or `publicShares` CRUD operations).
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase Firestore SDK functions to ensure tests are isolated and do not interact with a live Firebase project.
- Aim for good test coverage for the functions in `firestore.ts`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create Test File:** Start by creating `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest:** Ensure Vitest is configured correctly. If `vitest` is not already in `package.json` scripts, add a basic `test` script, e.g., `"test": "vitest"`. Adjust `vite.config.ts` if needed to integrate Vitest.
3.  **Mock Firebase:** Use `vi.mock` to mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` interacts with. This will allow testing the logic within the `firestore.ts` helpers without actual Firebase calls. Examples of functions to mock include `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `collection`, etc.
4.  **Write Tests:** For each significant public function in `src/lib/firestore.ts`, write at least one unit test case.
    *   Verify that the functions correctly call the mocked Firebase methods with the expected arguments.
    *   Test edge cases, such as empty inputs or expected error conditions, if applicable and easily mockable.
5.  **Run Tests:** Execute `npm run test` (or the equivalent Vitest command) to ensure all new tests pass.
6.  **Lint and Build:** Before concluding, run `npm run build && npm run lint` to confirm no build or linting issues are introduced.

This task focuses solely on `firestore.ts` and its corresponding tests. Do not add tests for other `src/lib/` files in this PR.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
