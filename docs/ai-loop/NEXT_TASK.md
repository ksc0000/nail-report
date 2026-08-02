# Worker Prompt Template

## Context

The current phase is 2.1 Test coverage. The goal is to improve the stability of the application by adding unit tests for critical helper functions.

## Objective

Implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to facilitate testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only if updating Vitest scripts, NOT for adding new dependencies)
- `vite.config.ts` (only if adding Vitest configuration)

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

### Task: Add Vitest unit tests for `src/lib/firestore.ts` helper functions

1.  **Create Test File**: Create a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK to prevent actual database calls during tests. Focus on mocking the `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, and `deleteDoc` functions as needed by `src/lib/firestore.ts`.
3.  **Write Unit Tests**:
    *   Write `describe` blocks and `it` tests for the main exported functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   Ensure tests cover successful operations and potential error scenarios if the `firestore.ts` functions include error handling logic.
    *   Verify that the helper functions correctly interact with the mocked Firestore methods (e.g., `addDoc` is called with the correct arguments).
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify the behavior and return values of the functions under test.
5.  **Run Tests**: Confirm that all new tests pass by running `npm test`.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` is created.
*   The Firebase Firestore SDK is appropriately mocked.
*   Unit tests cover at least `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
*   Tests pass when running `npm test`.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are in place
npm run build
npm run lint
npm test
```
