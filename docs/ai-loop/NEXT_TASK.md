# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing test coverage, starting with core utility functions.

## Objective

Add Vitest unit tests for key helper functions within `src/lib/firestore.ts`. The goal is to establish a testing foundation for Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactors for testability are allowed if absolutely necessary, but focus on testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for adding Vitest configuration if missing or incomplete)
- `package.json` (only for adding a `test` script like `vitest` if missing)
- `tsconfig.json` (only for adding `vitest/globals` types if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, assume `vitest` is already a devDependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two core Firestore helper functions (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) from `src/lib/firestore.ts`.
- Use `vi.mock('firebase/firestore')` to mock Firestore SDK functions as needed for isolation.
- Focus on basic happy path scenarios. Do not aim for full test coverage in this single PR.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement initial unit tests for the `src/lib/firestore.ts` file.

1.  **Verify Vitest Setup:** Ensure Vitest is configured and executable. If a `test` script is missing in `package.json`, add one (e.g., `"test": "vitest"`). If `vite.config.ts` needs `test` configuration (e.g., `globals: true`), add it. Assume `vitest` is already an installed `devDependency`.
2.  **Create Test File:** Create `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase:** Within `firestore.test.ts`, use `vi.mock('firebase/firestore')` to mock the Firestore SDK functions that your `firestore.ts` helpers depend on. You'll likely need to mock functions like `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc., and their return values.
4.  **Write Unit Tests:**
    *   Choose at least two critical functions from `src/lib/firestore.ts` (e.g., `createNailItem` and `getNailItems`).
    *   Write a basic happy path test for each chosen function.
    *   For `createNailItem`, test that `addDoc` is called with the correct arguments and that the function returns as expected.
    *   For `getNailItems`, test that `getDocs` is called and that the function correctly processes and returns data.
    *   Ensure tests are isolated and do not interact with actual Firebase services.
5.  **Run Tests:** Execute `npm test` (or `npm run vitest` if that's the script name) and ensure your new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no new errors are introduced.
7.  **Keep it Small:** Your changes, including the new test file, should adhere to the ≤150 line diff limit.
