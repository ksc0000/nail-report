# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to increase test coverage for core helper functions. This task directly addresses that goal by adding unit tests for the Firebase Firestore helper functions.

## Objective

Implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts` using Vitest and mock the Firebase SDK dependencies.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes to improve testability, if necessary, but primarily for testing existing logic)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only if Vitest or testing utilities need configuration, no new npm dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for core functions in `src/lib/firestore.ts`.
-   Use `vitest` and `vi.mock` for mocking Firebase SDK.
-   Focus on happy-path testing for CRUD operations.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

### Worker Prompt

Your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK dependencies, such as `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`. Ensure your mocks simulate successful operations and return realistic (but mocked) data structures that align with the expected outputs of `firestore.ts` functions.
3.  **Implement Unit Tests**:
    *   Write tests for the `addNailItem` function to ensure it correctly calls `addDoc` with the expected data and returns the correct `id`.
    *   Write tests for `getNailItems` to verify it fetches and transforms snapshot data correctly.
    *   Write tests for `updateNailItem` to confirm it calls `updateDoc` with the correct ID and data.
    *   Write tests for `deleteNailItem` to ensure it calls `deleteDoc` with the correct ID.
4.  **Consider edge cases**: While the primary focus is happy-path, consider if simple error conditions (e.g., a Firebase call rejects) can be tested easily by mocking without extensive changes to `firestore.ts`. If not, note this as a follow-up.
5.  **Run checks**: Ensure `npm run build` and `npm run lint` pass, and `npm run test` (or `vitest`) runs your new tests successfully.

**Example Mocking Pattern:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { addNailItem, getNailItems, updateNailItem, deleteNailItem } from '../lib/firestore';

// Mock Firebase Firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({ type: 'collectionRef' })),
    doc: vi.fn((db, path, id) => ({ type: 'docRef', id })),
    addDoc: vi.fn(async (collectionRef, data) => ({ id: 'mock-id-123' })),
    getDocs: vi.fn(async (queryRef) => ({
      docs: [
        { id: 'item1', data: () => ({ name: 'Nail Polish 1', tags: ['red'], userId: 'user1' }) },
        { id: 'item2', data: () => ({ name: 'Nail Polish 2', tags: ['blue'], userId: 'user1' }) },
      ],
    })),
    updateDoc: vi.fn(async () => {}),
    deleteDoc: vi.fn(async () => {}),
    query: vi.fn((colRef, ...constraints) => ({ type: 'queryRef', constraints })),
    orderBy: vi.fn(() => ({ type: 'orderByConstraint' })),
  };
});

// ... your tests
```
