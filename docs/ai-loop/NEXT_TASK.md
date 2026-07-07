# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort for core Firebase helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for one or two core `nailItem` CRUD helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on establishing the testing pattern for Firebase helper functions.

## Allowed Scope

- `src/lib/firestore.ts` (for minor modifications if needed for testability, but primarily for testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for essential Vitest configuration if missing, but assume Vitest is already configured per roadmap)
- `package.json` (only to confirm Vitest script exists, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

### Task: Add Vitest unit tests for `src/lib/firestore.ts` (nail item CRUD)

**Detailed Instructions:**

1.  **Identify Functions:** Review `src/lib/firestore.ts` and identify one or two key helper functions related to `nailItems` CRUD (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Choose functions that are good candidates for initial unit testing and demonstrate mocking Firebase.
2.  **Create Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
3.  **Implement Tests:**
    *   For the selected functions, write unit tests using Vitest.
    *   Crucially, **mock the Firebase SDK (`firebase/firestore`)** to isolate the logic of the `firestore.ts` helper functions. This involves using `vi.mock` to control the behavior of Firestore API calls (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
    *   Focus on testing the core logic and success paths for the chosen functions.
4.  **Acceptance Criteria:**
    *   A new test file `src/__tests__/lib/firestore.test.ts` is created and contains at least one passing `describe` block.
    *   At least one or two functions from `src/lib/firestore.ts` related to `nailItems` CRUD have dedicated unit tests.
    *   The Firebase SDK dependencies are correctly mocked to ensure tests are isolated and do not interact with actual Firebase services.
    *   All new tests pass when running `npm test`.

**Example Mocking Structure (conceptual):**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore'; // Import entire module to mock
import { addNailItem } from '../../lib/firestore'; // Your actual function

// Mock the firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if needed
    collection: vi.fn(() => ({})),
    addDoc: vi.fn(() => Promise.resolve({ id: 'test-id' })),
    // Mock other Firestore functions like getDocs, updateDoc, deleteDoc as needed
  };
});

describe('firestore.ts - addNailItem', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should add a nail item and return its ID', async () => {
    const mockNailItemData = { name: 'Test Nail', color: 'red' };
    const userId = 'user123';
    
    // Explicitly cast to mocked function for type safety and to check calls
    (firestore.addDoc as vi.Mock).mockResolvedValueOnce({ id: 'mock-nail-id' });

    const result = await addNailItem(userId, mockNailItemData);

    expect(result).toBe('mock-nail-id');
    expect(firestore.collection).toHaveBeenCalledWith(expect.any(Object), `users/${userId}/nailItems`);
    expect(firestore.addDoc).toHaveBeenCalledWith(expect.any(Object), mockNailItemData);
  });

  // Add more tests for error cases, other functions, etc.
});
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
