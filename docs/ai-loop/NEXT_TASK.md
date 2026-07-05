# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task contributes to "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Specifically, focus on the CRUD operations for `nailItems` and `publicShares` if applicable within this file, ensuring mock Firebase SDK is used.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only to add a `test` script if not already present or modify `vitest` config; *no new npm dependencies*)
- `vite.config.ts` (if Vitest configuration is needed, e.g., for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions exported from `src/lib/firestore.ts`.
- Utilize Vitest and mock the Firebase SDK (e.g., Firestore instance, collection, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, onSnapshot).
- Cover basic scenarios for adding, retrieving, updating, and deleting `nailItems`.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Jules,

Your task is to add unit tests for the Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Set up Vitest for Firebase mocking**: Ensure that your Vitest setup (likely `vite.config.ts` or a global setup file) correctly mocks the Firebase Firestore SDK. You will need to mock functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `getDocs`, and `onSnapshot` so that tests don't interact with actual Firebase services.
2.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
3.  **Write unit tests**:
    *   Focus on the primary functions in `src/lib/firestore.ts` that interact with the `nailItems` collection (e.g., functions for adding, fetching, updating, and deleting nail items).
    *   Ensure tests cover successful operations and potential error paths if the `firestore.ts` functions include error handling logic.
    *   Use Vitest's `describe`, `it`, and assertion methods (e.g., `expect`).
4.  **No new npm dependencies**: Do not add any new packages to `package.json`. If Vitest is not fully configured, adjust `package.json` scripts or `vite.config.ts` as needed, but without adding new `dependencies` or `devDependencies`.
5.  **Run checks**: Before submitting, ensure `npm run build`, `npm run lint`, and `npm test` all pass.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   The `src/__tests__/firestore.test.ts` file contains meaningful unit tests for at least the core CRUD operations related to `nailItems` using mocked Firebase Firestore SDK.
*   `npm run test` command successfully executes the new tests.
*   The overall PR diff is ≤ 150 lines.

**Required Test Commands:**
```bash
npm install # if needed to ensure dev dependencies are present
npm run build
npm run lint
npm test
```
