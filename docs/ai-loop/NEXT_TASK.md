# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets increasing test coverage for core helper functions using Vitest and mocking Firebase SDK.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, with appropriate Firebase Firestore SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration, if necessary, but keep changes minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Focus on testing `addNailItem` and `getNailItems` functions initially.
- Use `vi.mock` to mock the Firebase Firestore SDK calls (e.g., `addDoc`, `getDocs`, `collection`, `query`).
- Ensure the tests are isolated and do not interact with actual Firebase services.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**: Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (`addDoc`, `getDocs`, `collection`, `query`, `doc`, `updateDoc`, `deleteDoc`). Focus on mocking what's needed for `addNailItem` and `getNailItems`.
    -   For `addNailItem`, you will need to mock `collection` and `addDoc`.
    -   For `getNailItems`, you will need to mock `collection`, `query`, and `getDocs`.
    -   Ensure `getDocs` mock returns a structure similar to `QuerySnapshot` with a `docs` property, where each `doc` has `id` and `data()` methods.
3.  **Write tests for `addNailItem`**:
    -   Verify that `addDoc` is called with the correct collection path and data.
    -   Test successful addition.
4.  **Write tests for `getNailItems`**:
    -   Verify that `collection`, `query`, and `getDocs` are called correctly.
    -   Test that the returned data is correctly transformed from the mocked Firebase response.
    -   Test fetching items for a specific user ID.
5.  **Run tests**: Use `npm run test` to verify the tests pass.
6.  Ensure no new npm dependencies are added.
7.  Verify `npm run build` and `npm run lint` pass.

### Example structure for mocking `getDocs` (adapt as needed):

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addNailItem, getNailItems } from '../../lib/firestore'; // Adjust path

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    collection: vi.fn(() => ({ type: 'collectionRef' })), // Simple mock for collection reference
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        { id: 'item1', data: () => ({ name: 'Nail Polish 1', userId: 'user1' }) },
        { id: 'item2', data: () => ({ name: 'Nail Polish 2', userId: 'user1' }) },
      ],
      empty: false,
    })),
    query: vi.fn(() => ({ type: 'queryRef' })), // Simple mock for query reference
    where: vi.fn(() => ({ type: 'whereClause' })),
    orderBy: vi.fn(() => ({ type: 'orderByClause' })),
    // Add other mocks as needed for updateDoc, deleteDoc, etc., if expanding tests
  };
});

// Mock the firebase app and auth for the firestore functions (if they depend on it)
vi.mock('../../lib/auth', () => ({
  auth: { currentUser: { uid: 'user1' } },
  // mock any other auth exports needed by firestore.ts
}));

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  // Write tests for addNailItem here
  it('should add a nail item successfully', async () => {
    // ... test implementation
  });

  // Write tests for getNailItems here
  it('should retrieve nail items for a user', async () => {
    // ... test implementation
  });
});
```
