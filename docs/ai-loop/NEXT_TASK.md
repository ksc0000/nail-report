```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report emphasizes improving stability and test coverage in Phase 2. This task focuses on establishing a foundation for unit tests within the application, specifically for Firebase Firestore helper functions. Adding unit tests helps ensure the reliability of our data operations and provides quick feedback on changes.

## Objective

Implement unit tests for two core helper functions in `src/lib/firestore.ts`: `addNailItem` and `getNailItems`. Use Vitest for testing and ensure that Firebase SDK dependencies (like `getFirestore`, `collection`, `addDoc`, `getDocs`, etc.) are properly mocked to allow for isolated unit testing.

## Allowed Scope

-   `src/lib/firestore.ts` (for reading existing function signatures and logic)
-   `src/__tests__/firestore.test.ts` (create this new file for the tests)
-   `vite.config.ts` (only if absolutely necessary for Vitest setup, but prefer to assume existing setup)
-   `src/setupTests.ts` (if global mocks are needed, but prefer local mocks in the test file)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   `package.json` (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep the total diff for this task (including new test files) at or below 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Write unit tests for `addNailItem` and `getNailItems` functions, ensuring comprehensive coverage for success cases.
-   Mock all Firebase SDK functions that `addNailItem` and `getNailItems` directly call (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `where`, `doc`, `getDoc`, `updateDoc`, `deleteDoc` - focus on the ones used by the two target functions). Use `vi.mock` from Vitest.
-   The tests should run successfully using `npm test` (or `vitest`).
-   Run `npm run build && npm run lint` before finishing and ensure no errors.
-   Report any follow-up items or edge cases not covered by these initial tests as comments in the PR or in the suggested next task.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Acceptance Criteria

1.  A new file `src/__tests__/firestore.test.ts` is created.
2.  This file contains unit tests for `addNailItem` and `getNailItems`.
3.  Firebase SDK methods called by these functions are mocked effectively using `vi.mock`.
4.  The tests pass when running `npm test`.
5.  The total line diff for the PR is <= 150 lines.

## Required Test Commands

```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm test
```
```
