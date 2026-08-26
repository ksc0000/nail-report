# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" objective by adding unit tests for core helper functions.

## Objective

Implement comprehensive unit tests for the functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup needs adjustment for coverage)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory (except potentially `vitest.config.ts` if absolutely necessary for test setup)

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

---

## Worker prompt

### Summary of Task

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. This involves creating a new test file, mocking Firebase SDK dependencies, and writing tests for successful operations and potential error scenarios.

### Detailed Instructions

1.  **Create Test File:** Create a new file `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.) that are used within `src/lib/firestore.ts`. The goal is to test the logic of `firestore.ts` in isolation, without making actual calls to Firebase.
3.  **Write Unit Tests:**
    *   For each exported function in `src/lib/firestore.ts`, write at least one unit test case.
    *   Cover common scenarios like fetching data, adding new items, updating existing items, and deleting items.
    *   Consider testing error paths as well, by configuring your mocks to simulate Firebase throwing an error.
    *   Ensure proper cleanup of mocks between tests if necessary (e.g., using `beforeEach` or `afterEach`).
4.  **Ensure Testability:** If any functions or components in `src/lib/firestore.ts` are not easily testable due to their structure, make minimal, clean refactorings (e.g., ensuring functions are properly exported or dependencies can be injected) to enable effective testing.

### Acceptance Criteria

*   A new test file `src/__tests__/lib/firestore.test.ts` is created and contains unit tests.
*   All exported functions in `src/lib/firestore.ts` have adequate test coverage.
*   Firebase SDK interactions are mocked, and tests do not make actual Firebase calls.
*   Tests cover both successful execution paths and error scenarios relevant to `firestore.ts` functions.
*   Running `npm run test` passes successfully.
*   The overall diff remains within the ≤150 line limit.

### Required Test Commands

```bash
npm install # Ensure Vitest is installed if not already, but it should be.
npm run test
npm run build
npm run lint
```
