```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" objective by adding unit tests for core Firebase Firestore helper functions. Vitest is already configured for the project.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, but primarily for understanding)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup needs minor adjustments, unlikely)
- `package.json` (only to add `test` script if missing, no new dependencies)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to create a new test file `src/__tests__/firestore.test.ts` and add unit tests for the helper functions within `src/lib/firestore.ts`.

Specifically:

1.  **Create Test File**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock the Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`) that `src/lib/firestore.ts` interacts with. This ensures that tests are isolated and do not perform actual Firebase calls.
3.  **Test Helper Functions**: Write tests for the primary CRUD (Create, Read, Update, Delete) operations provided by the `firestore.ts` helpers.
    *   Verify that functions correctly call the mocked Firebase Firestore methods with the expected arguments (collection paths, document IDs, data payloads).
    *   Test both successful execution and potential error handling scenarios (if present in the helpers).
    *   Ensure tests cover typical usage patterns for retrieving and manipulating `nailItems` or other relevant collections managed by `firestore.ts`.

Example mocking strategy:

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, collection, addDoc, updateDoc, deleteDoc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
// Import your functions from src/lib/firestore.ts, e.g.,
// import { addNailItem, updateNailItem, deleteNailItem, getNailItem, getNailItems } from '../lib/firestore';

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...original,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a simple object
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(() => ({
      empty: false,
      docs: [{ id: 'testId1', data: () => ({ name: 'Test Nail' }) }],
    })),
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should call addDoc when adding a nail item', async () => {
    // Implement test for addNailItem or similar
    // For example: await addNailItem({ name: 'New Nail', userId: 'user123' });
    // expect(addDoc).toHaveBeenCalledWith(expect.any(Object), { name: 'New Nail', userId: 'user123' });
  });

  // Add more tests for update, delete, get operations
});
```

Ensure the tests are comprehensive but remain within the line limit. Prioritize core CRUD operations.

```
