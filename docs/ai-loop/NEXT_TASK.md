```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product roadmap indicates an active Phase 2 focused on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1 Test coverage, by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, specifically mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (no significant changes, only potential minor refactoring to enable testing if absolutely necessary, but focus on testing existing code)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
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

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Set up the test file**:
    *   Create a new test file: `src/__tests__/firestore.test.ts`.

2.  **Mock Firebase SDK**:
    *   Use `vi.mock('firebase/firestore')` to mock the Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
    *   Use `vi.mock('firebase/app')` if `getFirestore` is called directly in `firestore.ts` and needs mocking.
    *   Ensure the mocks provide controlled return values or implement the expected behavior for your tests.

3.  **Write unit tests**:
    *   Focus on testing at least two key functions from `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems` or `updateNailItem` and `deleteNailItem`.
    *   For each function, write at least one test case covering a successful operation.
    *   Verify that the Firebase SDK functions are called with the correct arguments.
    *   Verify that the helper functions return the expected values on success.

4.  **Execute tests**:
    *   Run `npm run test` (assuming `test` script is configured for Vitest) and ensure all new tests pass.

5.  **Lint and build**:
    *   Run `npm run lint` and `npm run build` to ensure code quality and build integrity. Resolve any errors.

This task is a foundational step for improving the overall stability and reliability of the application by ensuring core data operations work as expected.
```
