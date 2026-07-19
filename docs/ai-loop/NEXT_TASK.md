```markdown
# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key part of this phase is establishing unit test coverage for helper functions, starting with those that interact with Firebase Firestore. Vitest has been selected as the test runner.

## Objective

Implement initial unit tests for helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK interactions. This task aims to cover at least one CRUD operation, such as adding a new item.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability, but focus on testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for setup if absolutely necessary for mocking, but avoid major refactors)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for build/lint configurations as specified in "Allowed Scope".

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Focus on mocking Firebase Firestore SDK functions (`doc`, `setDoc`, `getDocs`, `collection`, `query`, etc.) using `vi.mock` to isolate the logic in `src/lib/firestore.ts`.
- Write at least one unit test for a function in `src/lib/firestore.ts` that performs a write operation (e.g., `addItem`, `updateItem`).
- Ensure the test asserts the correct Firebase SDK calls are made with the expected arguments.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add initial unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: At the top of `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the `firebase/firestore` module. You will need to mock functions like `doc`, `collection`, `setDoc`, `updateDoc`, `getDocs`, `query`, `where`, and potentially others that are used within `src/lib/firestore.ts`. The mocks should allow you to track if these functions are called and with what arguments.
    *   Example:
        ```typescript
        // src/__tests__/firestore.test.ts
        import { describe, it, expect, vi } from 'vitest';
        // ... other imports

        // Mock Firebase Firestore
        const mockDoc = vi.fn();
        const mockCollection = vi.fn(() => ({
          withConverter: vi.fn(() => ({
            add: vi.fn(),
            get: vi.fn(),
            // ... other collection methods you might need to mock
          })),
        }));
        const mockSetDoc = vi.fn();
        const mockUpdateDoc = vi.fn();
        const mockGetDocs = vi.fn();
        const mockQuery = vi.fn();
        const mockWhere = vi.fn();

        vi.mock('firebase/firestore', async (importOriginal) => {
          const original = await importOriginal<typeof import('firebase/firestore')>();
          return {
            ...original,
            doc: mockDoc,
            collection: mockCollection,
            setDoc: mockSetDoc,
            updateDoc: mockUpdateDoc,
            getDocs: mockGetDocs,
            query: mockQuery,
            where: mockWhere,
            // ... mock other functions as needed
          };
        });
        ```
3.  **Implement a test for `addItem` (or similar write function)**:
    *   Choose the `addItem` function (or a similar one like `updateItem` or `deleteItem`) from `src/lib/firestore.ts`.
    *   Write a test case that calls this function.
    *   Assert that the mocked Firebase Firestore functions (e.g., `collection`, `doc`, `setDoc`) are called with the expected arguments when `addItem` is invoked.
    *   Ensure the test cleans up mocks using `vi.clearAllMocks()` or `vi.resetAllMocks()` between tests within a `beforeEach` or `afterEach` block.

4.  **Run tests**: After writing the tests, run `npm run test` to ensure they pass.

5.  **Lint and Build**: Ensure the project still builds and passes lint checks: `npm run build && npm run lint`.
```
