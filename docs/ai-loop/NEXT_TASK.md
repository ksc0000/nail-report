```markdown
# Worker Prompt Template

## Context

The current focus for `nail-report` is Phase 2 of the roadmap: improving stability, test coverage, and UX. This task specifically addresses Phase 2.1 (Test coverage) by adding unit tests for core Firebase Firestore helper functions. Vitest is already configured as the test runner, and Firebase SDK mocking should be utilized.

## Objective

Add Vitest unit tests for the `getNailItems` and `createNailItem` helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no logic changes)
- `src/lib/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (if minor Vitest configuration for mocks is required, but prefer to mock directly in test file)

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

## Worker prompt

### Task: Add Vitest unit tests for `getNailItems` and `createNailItem` in `src/lib/firestore.ts`

**Detailed Steps:**

1.  **Create a new test file:** Create `src/lib/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Inside `src/lib/__tests__/firestore.test.ts`, implement mocks for the necessary Firebase Firestore SDK functions (`collection`, `getDocs`, `addDoc`, etc.) using `vi.mock` to simulate successful and failed Firestore operations.
    *   Focus on mocking the behavior required by `getNailItems` (e.g., returning a snapshot of documents) and `createNailItem` (e.g., simulating a successful document addition or an error).
3.  **Write tests for `getNailItems`:**
    *   Test that `getNailItems` correctly fetches and formats data from the mocked Firestore.
    *   Test its behavior when no items are present.
    *   Test error handling (if `getNailItems` includes it, otherwise just successful path).
4.  **Write tests for `createNailItem`:**
    *   Test that `createNailItem` correctly calls the mocked `addDoc` with the provided data.
    *   Test that it returns the expected output (e.g., document ID or success status).
    *   Test error handling when the mocked `addDoc` fails.
5.  **Ensure test isolation:** Each test should be independent and not rely on the state of other tests.
6.  **Verify local execution:** Run `npm test` to confirm all new tests pass.

**Acceptance Criteria:**

*   A new file `src/lib/__tests__/firestore.test.ts` is created.
*   The Firebase Firestore SDK is appropriately mocked within `firestore.test.ts` for the functions under test.
*   Comprehensive unit tests are implemented for `getNailItems` and `createNailItem` functions, covering success and basic error scenarios.
*   All new tests pass when running `npm test`.
*   The diff size is within the allowed limits (≤ 150 lines).

```
```
