```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding unit tests for core Firebase Firestore helper functions, which is crucial for ensuring data integrity and application reliability. Vitest is the designated test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, with appropriate mocking of Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if strictly necessary, e.g., exporting internal functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor config adjustments are needed for mocks, but prefer to avoid)

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

Your task is to add comprehensive unit tests for the Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock the `firebase/firestore` module and its methods (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Ensure the mocks simulate successful operations and potential error scenarios.
3.  **Test `addItem`**: Write tests to verify `addItem` correctly adds a document and handles errors.
4.  **Test `updateItem`**: Write tests to verify `updateItem` correctly updates a document and handles errors.
5.  **Test `deleteItem`**: Write tests to verify `deleteItem` correctly deletes a document and handles errors.
6.  **Test `getNailItems`**: Write tests to verify `getNailItems` correctly fetches and processes documents, including empty states and error handling.
7.  **Run tests**: Ensure all new tests pass by running `npm run test`.
8.  **Verify code quality**: Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

Focus on testing the logic within the `firestore.ts` functions themselves, ensuring they correctly interact with the mocked Firebase SDK.
```
