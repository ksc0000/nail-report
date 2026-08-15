```markdown
# Worker Prompt Template

## Context

The product roadmap indicates Phase 2.1 is focused on increasing test coverage, specifically targeting unit tests for Firestore helper functions. The current state shows no specific task from the "Jules-ready Tasks" list has been picked yet. This task addresses the first item in the "Jules-ready Tasks" list and directly contributes to improving the stability of the application's core data interactions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring robust test coverage for Firestore interactions.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (specifically `src/lib/firestore.ts`)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer no changes here)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

### Task: Add Vitest Unit Tests for `src/lib/firestore.ts` Helpers

**Detailed Instructions:**

1.  **Create Test File**: Create a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore**:
    *   Within `src/__tests__/firestore.test.ts`, set up Vitest to mock the `firebase/firestore` module. This will involve using `vi.mock('firebase/firestore', ...)` to provide mock implementations for Firestore functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `query`, `where`, etc.).
    *   Ensure the mocks allow for simulating both successful operations and error scenarios.
3.  **Identify Functions to Test**: Focus on the primary CRUD and retrieval functions in `src/lib/firestore.ts`. Examples include:
    *   `getNailItems`
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getPublicShare`
    *   `addPublicShare`
    *   `deletePublicShare`
    *   `updatePublicShare`
4.  **Write Unit Tests**:
    *   For each identified function, write unit tests that cover its expected behavior.
    *   **Success Scenarios**: Test that functions correctly interact with the mocked Firestore and return/resolve with the expected data or outcome.
    *   **Error Scenarios**: Test how functions handle errors returned by the mocked Firestore (e.g., network issues, permission denied), ensuring they throw/reject appropriately or return expected error states.
    *   **Data Transformation**: Verify any data mapping or transformation logic within the functions.
5.  **Run Tests**: Execute `npm test` and ensure all new tests pass.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` exists.
*   The `firestore.test.ts` file contains unit tests for the core helper functions in `src/lib/firestore.ts`.
*   Firebase Firestore SDK interactions are properly mocked.
*   Tests cover both successful execution and error handling for relevant functions.
*   All tests pass when running `npm test`.

**Required Test Commands:**

```bash
npm run build
npm run lint
npm test
```
```
