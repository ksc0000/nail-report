# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to enhance test coverage by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (for potential minor refactoring to enable easier testing)
- `src/__tests__/firestore.test.ts` (new test file)

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

You are tasked with writing unit tests for the functions within `src/lib/firestore.ts`. This file contains helper functions for interacting with Firestore, such as adding, updating, and deleting nail items, as well as managing tags and public shares.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vitest`'s mocking capabilities (`vi.mock`) to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, `startAfter`) to ensure tests are isolated and do not interact with a live Firestore instance. Focus on mocking the return values that simulate successful operations and specific data retrieval.
3.  **Identify key functions:** Prioritize testing the main CRUD operations for `nailItems` and `tags`, and functions related to `publicShares`. Examples include `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addTag`, `getTags`, `addPublicShare`, `getPublicShare`.
4.  **Write unit tests:** For each selected function, write one or more `test` blocks to verify its behavior under different conditions (e.g., successful creation, successful retrieval, successful update, successful deletion).
5.  **Focus on mocking return values:** Ensure that your mocks provide realistic (but static) return values for Firestore operations, such as document references, snapshots, and query results.
6.  **Avoid testing Firebase integration:** The goal is to test the logic *within* the `firestore.ts` helpers, not the Firebase SDK itself.

**Acceptance Criteria:**

-   A new file `src/__tests__/firestore.test.ts` exists.
-   At least three key helper functions from `src/lib/firestore.ts` have corresponding unit tests.
-   Firebase SDK interactions are properly mocked using `vitest`.
-   All tests pass when running `npm test`.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are in place
npm run build
npm run lint
npm test
```
