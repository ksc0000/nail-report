# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes improving stability and test coverage in Phase 2. This task focuses on adding unit tests for Firebase helper functions using Vitest and mocking the Firebase SDK.

## Objective

Implement Vitest unit tests for the `addNailItem` helper function in `src/lib/firestore.ts`, ensuring proper interaction with the mocked Firebase Firestore SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer to only *test* it)
-   `src/__tests__/firestore.test.ts` (new file)
-   `vite.config.ts` (minimal configuration for Vitest if absolutely required, e.g., enabling global mocks, but prioritize existing setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file not explicitly listed in "Allowed Scope"

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker Prompt

Your task is to add unit tests for `src/lib/firestore.ts` using Vitest, starting with the `addNailItem` function.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Use `vi.mock('firebase/firestore')` to mock the necessary functions that `addNailItem` uses (e.g., `collection`, `doc`, `setDoc`). The mocks should capture calls to ensure correct arguments are passed.
3.  **Write a test for `addNailItem`:**
    *   Test the successful addition of a nail item.
    *   Verify that `addNailItem` calls the mocked Firestore functions with the expected arguments (e.g., correct collection path, correct item data).
    *   Ensure the function returns the expected result (e.g., the generated item ID).
4.  **No new npm packages:** Ensure no new dependencies are added to `package.json`. Vitest should be already configured or require minimal setup in `vite.config.ts`.
5.  **Keep it focused:** Only test `addNailItem` in this iteration. Other `firestore.ts` functions (get, update, delete) will be covered in subsequent tasks.

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is created.
-   This file contains at least one passing unit test for the `addNailItem` function.
-   The test correctly mocks Firebase Firestore SDK functions (`collection`, `doc`, `setDoc`) and asserts their calls and arguments.
-   The existing application functionality remains unchanged.

### Required Test Commands

```bash
npm install # Ensure all dependencies are up to date
npm run test # Run the new Vitest tests
npm run build
npm run lint
```
