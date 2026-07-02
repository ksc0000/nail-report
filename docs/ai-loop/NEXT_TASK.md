```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the `getNailItems` and `addNailItem` helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` needs to be initialized/configured, but no new *runtime* dependencies should be added)
- `vite.config.ts` (if Vitest configuration is required)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages *without explicit human approval* beyond Vitest setup if not already present)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the `getNailItems` and `addNailItem` functions within `src/lib/firestore.ts` using Vitest.

1.  **Setup Vitest (if necessary):** Ensure Vitest is configured and ready to run tests. If a `vite.config.ts` needs modification or a basic `vitest` setup in `package.json` is required, do so.
2.  **Create Test File:** Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:** Utilize `vi.mock` to mock the Firebase Firestore SDK. Specifically, mock the necessary Firestore methods (e.g., `collection`, `query`, `getDocs`, `addDoc`) that `getNailItems` and `addNailItem` interact with. The mocking should allow simulating successful responses and potential errors.
4.  **Implement Tests for `getNailItems`:**
    *   Write a test case to verify `getNailItems` successfully fetches and transforms a list of nail items.
    *   Write a test case to ensure `getNailItems` handles an empty collection correctly.
    *   Consider a test case for error handling if the Firestore call fails (e.g., mock `getDocs` to throw an error).
5.  **Implement Tests for `addNailItem`:**
    *   Write a test case to verify `addNailItem` successfully adds a new item to Firestore and returns the expected ID.
    *   Consider a test case for error handling if the Firestore call fails (e.g., mock `addDoc` to throw an error).
6.  **Run Tests:** Execute the tests to ensure they pass.
7.  **Lint and Build:** Run `npm run lint` and `npm run build` to verify code quality and build integrity.

Focus on creating robust mocks and clear test cases for these two functions to keep the PR focused and small.
```
