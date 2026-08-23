# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. The current state shows that Phase 2 is active, and no substantive tasks have been completed yet. This task addresses the first item in the test coverage section of Phase 2.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Implement unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**:
    *   Use `vi.mock('firebase/firestore')` to mock the Firebase Firestore module.
    *   Mock the necessary Firestore functions (e.g., `collection`, `doc`, `addDoc`, `getDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`) to control their behavior during tests.
    *   Ensure that mocked functions return appropriate mock values (e.g., mock snapshots for `getDoc`/`getDocs`, mock document references for `addDoc`).
3.  **Write tests for `src/lib/firestore.ts` helper functions**:
    *   Focus on at least 2-3 key helper functions that perform CRUD operations on `nailItems` (e.g., `addNailItem`, `getNailItems`, `deleteNailItem` if they exist and are exported).
    *   Tests should verify that the `firestore.ts` helpers correctly call the underlying mocked Firebase Firestore SDK methods with the expected arguments.
    *   Include tests for successful execution paths. Consider testing error paths if a simple mock can simulate an error.
4.  **Ensure exportability**: If any functions in `src/lib/firestore.ts` are not exported but need to be tested, modify `src/lib/firestore.ts` to export them. Keep these changes minimal.

### Acceptance Criteria

- A new test file `src/__tests__/lib/firestore.test.ts` is created.
- The Firebase Firestore SDK is appropriately mocked using `vi.mock`.
- At least 2-3 significant helper functions from `src/lib/firestore.ts` have dedicated unit tests.
- Tests verify correct interaction with the mocked Firestore SDK (e.g., `addDoc` was called with correct collection and data).
- All tests pass when running `npm test`.

### Required test commands

```bash
npm test
npm run build
npm run lint
```
