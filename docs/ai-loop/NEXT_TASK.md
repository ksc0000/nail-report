```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Allowed Scope

-   `src/lib/firestore.ts`
-   `src/__tests__/firestore.test.ts` (new file)
-   Existing test configuration files (e.g., `vitest.config.ts`) if absolutely necessary for mocking, but prefer to avoid modifications if possible.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

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

## Worker Prompt

### Task

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

### Details

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Use Vitest for testing:** The project's roadmap indicates Vitest is the designated test runner and implies it is already set up. No new Vitest installation or major configuration is expected.
3.  **Mock Firebase SDK functions:** Use `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`) to isolate tests from actual Firebase interactions. Focus on mocking the Firebase library rather than individual functions within `src/lib/firestore.ts` directly, to ensure `src/lib/firestore.ts` functions are tested as units.
4.  **Write unit tests:** Cover the core CRUD and subscription helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, and `subscribeToNailItems`. The tests should verify the logic within these wrapper functions, not the underlying Firebase SDK behavior itself.

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is created.
-   The new test file contains comprehensive unit tests for the helper functions in `src/lib/firestore.ts`.
-   Firebase SDK interactions are properly mocked to prevent actual network calls during tests.
-   All tests pass when running `npm run test`.
-   The overall change set (diff) does not exceed 150 lines.
-   `npm run build` and `npm run lint` execute successfully without errors or warnings.

### Required Test Commands

```bash
npm run test
npm run build
npm run lint
```
```
