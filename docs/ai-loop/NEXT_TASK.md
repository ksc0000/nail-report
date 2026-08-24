```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-phase is "2.1 Test coverage", specifically mentioning unit tests for Firebase helper functions. This task addresses that goal by adding foundational tests for the Firestore library.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications if needed for testability, e.g., exports)
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only if absolutely necessary for Vitest configuration, no new dependencies)
- `vite.config.ts` (only if necessary for Vitest configuration)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` (no new npm packages/dependencies)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related CSS files
- Any files not directly related to Firestore helpers or their tests.

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the `addDocument`, `updateDocument`, `deleteDocument`, and `getCollection` helper functions in `src/lib/firestore.ts`.
- Mock Firebase SDK (Firestore instances, collection/document references, etc.) using `vi.mock` as appropriate, to ensure tests are isolated and fast.
- Cover both successful execution paths and basic error handling where applicable (e.g., failed document additions).
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Create Test File:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase:** Set up Vitest mocks for Firebase Firestore methods and objects (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`) as needed to isolate tests from actual Firebase interactions.
3.  **Test `addDocument`:** Write unit tests for `addDocument` to ensure it correctly calls `addDoc` with the provided data and collection path. Test for success and potential errors.
4.  **Test `updateDocument`:** Write unit tests for `updateDocument` to verify it correctly calls `updateDoc` with the document reference and data. Test for success and potential errors.
5.  **Test `deleteDocument`:** Write unit tests for `deleteDocument` to confirm it correctly calls `deleteDoc` with the document reference. Test for success and potential errors.
6.  **Test `getCollection`:** Write unit tests for `getCollection` to ensure it correctly fetches documents from a collection and transforms them. Mock `getDocs` and `query` as necessary.
7.  **Run Tests:** Execute `npm test` and ensure all new tests pass.
8.  **Lint & Build:** Run `npm run lint` and `npm run build` to confirm no new errors are introduced.
```
