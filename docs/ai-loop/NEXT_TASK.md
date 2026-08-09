```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on implementing unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

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

Implement comprehensive unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vitest` and `vi.mock` to mock `firebase/firestore` functions, ensuring tests do not interact with actual Firebase services. Focus on mocking `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `limit`, etc., as needed by the `firestore.ts` helpers.
3.  **Test key helper functions:**
    *   `addNailItem`: Test successful addition and error handling.
    *   `updateNailItem`: Test successful update (e.g., merging data) and error handling.
    *   `deleteNailItem`: Test successful deletion and error handling.
    *   `getNailItems`: Test retrieving multiple items, including potential query parameters (if `firestore.ts` exposes them).
    *   `getNailItemById`: Test retrieving a single item by ID.
    *   Ensure edge cases like empty responses or non-existent items are handled correctly in tests.
4.  **Assertions:** Use Vitest's assertion library (`expect`) to verify function behavior, return values, and error conditions.
5.  **Code Coverage:** Aim for good coverage for the tested `firestore.ts` functions.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- `firestore.test.ts` includes unit tests for the primary CRUD and retrieval functions in `src/lib/firestore.ts`.
- All tests pass when running `npm test`.
- Firebase SDK interactions are mocked, and tests run in isolation.
- `npm run build` completes without errors.
- `npm run lint` completes without errors.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`).
```
