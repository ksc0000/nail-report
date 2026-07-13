# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets increasing unit test coverage, including for Firestore helper functions, using Vitest and mocking the Firebase SDK.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK dependencies are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary, but primary changes are for tests)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/App.css` (No changes expected for this task)
-   `vitest.config.ts` (Minor adjustments related to mocking, if absolutely necessary and without adding new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval; Vitest is assumed to be an existing `devDependency`)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

### Worker Prompt

Your goal is to add comprehensive unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, `getDoc`) and any other Firebase-related dependencies (`firebase/app`, `firebase/firestore`). Ensure mocks provide predictable return values for testing different scenarios.
3.  **Test Helper Functions:** Write unit tests for the primary functions exported from `src/lib/firestore.ts`, such as `addDocument`, `updateDocument`, `deleteDocument`, `getDocuments`, `getDocument`, etc.
    *   Verify that the correct Firestore methods are called with the expected arguments.
    *   Test successful operations.
    *   Test error handling scenarios (e.g., how the helper functions propagate or handle Firestore errors).
4.  **Run Tests:** Execute the tests using `npm test` or `vitest`.
5.  **Adhere to Constraints:** Ensure the pull request diff is small (≤150 lines) and no new npm packages are added.

**Example Mocking Structure Hint:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import the functions to test

// Mock Firebase SDK
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  };
});

describe('firestore.ts helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call addDoc when adding a document', async () => {
    const { addDoc } = await import('firebase/firestore'); // Import the mocked function
    (addDoc as vi.Mock).mockResolvedValueOnce({ id: 'new-id' });

    const collectionName = 'testCollection';
    const data = { name: 'Test Item' };
    const result = await firestoreLib.addDocument(collectionName, data);

    expect(addDoc).toHaveBeenCalledWith(expect.anything(), data); // Check `collection` mock in detail
    expect(result).toEqual('new-id');
  });

  // Add more tests for updateDocument, deleteDocument, getDocuments, etc.
});
```
