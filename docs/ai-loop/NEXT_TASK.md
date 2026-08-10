```markdown
# Worker Prompt Template

## Context

The project is in Phase 2.1, focusing on improving test coverage. The current task is to add unit tests for helper functions in `src/lib/`.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest, focusing on core CRUD operations or helper utilities present in that file.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if absolutely necessary, but prioritize testing existing public functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup is not complete, but assume it is ready for use)
- `package.json` (only to add `vitest` script if missing, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except potentially `vitest` itself if not yet added for the test script)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Focus on testing at least two distinct functions or logical blocks within `src/lib/firestore.ts`.
- Ensure tests cover basic success cases and ideally one error case if applicable.
- Run `npm run test` (if available, otherwise `vitest`) and `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` file.

1.  **Set up Vitest:** Ensure `vitest` is correctly configured and can be run. If not, add a `test` script to `package.json` that runs `vitest`.
2.  **Create Test File:** Create a new file named `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase:** Use `vi.mock` to mock the Firebase SDK (e.g., `firebase/firestore`) to prevent actual database calls during tests. Focus on mocking the specific Firestore methods that `src/lib/firestore.ts` interacts with (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
4.  **Write Tests:** Write unit tests for at least two functions found in `src/lib/firestore.ts`.
    *   Examples of functions to test: `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`.
    *   Include tests for successful operations and consider at least one test case for error handling (e.g., a mock Firebase function throws an error).
5.  **Verify:**
    *   Run `npm run test` (or `vitest`) and ensure all new tests pass.
    *   Run `npm run build && npm run lint` to ensure no build or linting issues are introduced.

Remember to keep the diff small and focused on adding tests for `firestore.ts`.
```
