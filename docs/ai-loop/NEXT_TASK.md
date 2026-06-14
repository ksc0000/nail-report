```markdown
# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for core helper functions, specifically targeting Firebase Firestore interactions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. This will involve setting up mocks for the Firebase SDK to ensure isolated testing.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but focus on testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor adjustments are needed for Firebase mocking)

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

Your task is to implement initial unit tests for helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` functions like `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, etc. The mocks should simulate successful operations and potentially common error scenarios.
3.  **Select functions to test:** Focus on 1-2 key CRUD-related functions from `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, or `deleteNailItem`.
4.  **Write unit tests:** For each selected function, write tests that:
    *   Verify the function calls the correct mocked Firebase Firestore methods with the expected arguments.
    *   Assert the return value (e.g., successful ID, void, or error).
    *   Test both successful execution and how errors are handled (e.g., if a Firestore operation fails).

### Example of Firebase mocking for Vitest:

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreModule from 'firebase/firestore'; // Import everything as module

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({ type: 'collectionRef' })), // Mock collection
    doc: vi.fn(() => ({ type: 'docRef' })), // Mock doc
    addDoc: vi.fn(async (collectionRef, data) => ({ id: 'new-id', path: 'collection/new-id' })),
    updateDoc: vi.fn(async (docRef, data) => undefined),
    deleteDoc: vi.fn(async (docRef) => undefined),
    // Mock other necessary Firestore functions here
  };
});

// Now, in your tests, you can assert on these mocked functions
describe('firestore helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  it('should call addDoc when adding a nail item', async () => {
    // ... test your helper function that uses addDoc
    // expect(firestoreModule.addDoc).toHaveBeenCalledWith(...)
  });
});
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
