```markdown
# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on stability, test coverage, and UX. This task addresses "2.1 Test coverage" by adding unit tests for a core Firebase module.

## Objective

Implement unit tests for the `addDocument` and `getDocumentById` functions in `src/lib/firestore.ts` using Vitest and mock the Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to support testability if necessary, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `setDoc`, `deleteDoc`) as needed to isolate `firestore.ts` logic.
- Ensure the tests cover successful execution paths for `addDocument` and `getDocumentById`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `addDocument` and `getDocumentById` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Import Vitest**: Use `import { describe, it, expect, vi, beforeEach } from 'vitest';`.
3.  **Mock Firebase SDK**: Implement mocks for Firebase Firestore functions that `src/lib/firestore.ts` interacts with. For example, mock `getFirestore`, `collection`, `addDoc`, `doc`, `getDoc` to control their return values and ensure `firestore.ts` functions are tested in isolation. The `vi.mock()` feature of Vitest is suitable for this.
4.  **Write tests for `addDocument`**:
    *   Test that `addDocument` successfully adds a document to a specified collection.
    *   Assert that `addDoc` is called with the correct arguments.
    *   Verify the return value matches the expected document ID.
5.  **Write tests for `getDocumentById`**:
    *   Test that `getDocumentById` retrieves an existing document correctly.
    *   Assert that `doc` and `getDoc` are called with the correct arguments.
    *   Verify the returned data matches the mocked document snapshot data.
    *   Consider a test case for when a document is not found (e.g., returns `null` or `undefined`).
6.  **Maintain good test practices**: Use `beforeEach` to reset mocks if necessary for test isolation.
7.  **Run checks**: Ensure `npm run build && npm run lint` pass without errors.

```
