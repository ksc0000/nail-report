```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX improvements. The current state shows that initial AI Loop setup is complete, and a substantive task is now pending. This task focuses on improving test coverage, specifically by adding unit tests for Firebase helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if necessary, but prefer to test existing interface)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (if minimal Vitest configuration is absolutely required, prefer to assume it's set up)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside the `src/` directory, except as explicitly allowed.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Use `vi.mock` to mock Firebase Firestore SDK interactions.
-   Write at least one unit test for `addNailItem` in `src/lib/firestore.ts`.
-   Write at least one unit test for `getNailItems` in `src/lib/firestore.ts`.
-   Ensure tests run successfully using `npm test`.
-   Run `npm run build && npm run lint` before finishing.

## Worker prompt

Your task is to add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore:** Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `query`, `orderBy`, `where`, `getFirestore`, etc.) that `src/lib/firestore.ts` interacts with. Your mocks should simulate successful operations to allow testing the logic within `firestore.ts`.
3.  **Implement tests for `addNailItem`:**
    *   Write a test case that verifies `addNailItem` successfully calls the mocked `addDoc` function with the correct arguments.
    *   Verify the return value or side effect (e.g., the function resolves successfully).
4.  **Implement tests for `getNailItems`:**
    *   Write a test case that verifies `getNailItems` correctly constructs and executes a Firestore query (e.g., calling `collection`, `query`, `orderBy`, `getDocs`).
    *   Mock `getDocs` to return a predefined `QuerySnapshot` containing mock `DocumentSnapshot` objects.
    *   Verify that `getNailItems` correctly transforms and returns the data from the mocked Firestore response.
5.  **Run Tests:** Execute `npm test` and ensure all new tests pass.
6.  **Code Quality:** Ensure `npm run build && npm run lint` pass.

**Example structure for mocking (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import the functions you need to test
import { addNailItem, getNailItems } from '../lib/firestore';

// Mock firebase/firestore
const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockCollection = vi.fn(() => ({})); // or more complex if needed
const mockDoc = vi.fn(() => ({}));
const mockQuery = vi.fn(() => ({}));
const mockOrderBy = vi.fn(() => ({}));
const mockWhere = vi.fn(() => ({}));
const mockGetFirestore = vi.fn(() => ({}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: mockGetFirestore,
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    getDocs: mockGetDocs,
    query: mockQuery,
    orderBy: mockOrderBy,
    where: mockWhere,
    // Add other Firestore functions as needed
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addNailItem should correctly add an item', async () => {
    // Implement test for addNailItem
    // Arrange: Set up mockAddDoc to resolve successfully
    // Act: Call addNailItem
    // Assert: Expect mockAddDoc to have been called with correct arguments
  });

  it('getNailItems should fetch and transform items correctly', async () => {
    // Implement test for getNailItems
    // Arrange: Set up mockGetDocs to return mock data
    // Act: Call getNailItems
    // Assert: Expect mockGetDocs to have been called
    // Assert: Expect the returned array to match the transformed mock data
  });
});
```
