# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses the "Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter production code unless necessary for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is needed, but should already be configured based on roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any UI-related CSS/components

## Requirements

- Keep diff ≤ 150 lines. Focus on testing a few key functions in `src/lib/firestore.ts`.
- Use Vitest for testing and mock Firebase SDK where necessary.
- Add a new test file: `src/__tests__/firestore.test.ts`.
- Run `npm run build && npm run lint && npm run test` before finishing.
- The tests should verify the correct interaction with Firestore (e.g., calling `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` with correct arguments), mocking the actual Firebase calls.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for a few core helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocking for Firebase:** You will need to mock Firebase Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc.) to isolate the helper functions and test their logic without actual Firebase calls.
3.  **Choose 2-3 key functions from `src/lib/firestore.ts` to test.** Good candidates would be functions related to adding, getting, or deleting nail items. For example, if there's a `createNailItem` or `getNailItems` function.
4.  **Write unit tests for these selected functions.**
    *   Ensure they correctly call the mocked Firestore methods with the expected arguments.
    *   Test both successful execution and potential error paths (if the helper functions include error handling logic).
5.  **Run `npm run test`** to confirm tests pass.
6.  **Run `npm run build && npm run lint`** to ensure no build or linting errors are introduced.

**Example of mocking Firebase Firestore (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts (conceptual)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import the file containing helpers
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'; // Import for type hinting/mocking targets

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    // Mock other Firestore functions as needed
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should call addDoc when creating a nail item', async () => {
    // Assuming a function like `firestoreLib.addNailItem({ name: 'test' }, 'userId')` exists
    // And `addDoc` returns a mock DocumentReference
    (addDoc as vi.Mock).mockResolvedValue({ id: 'testId' });
    (collection as vi.Mock).mockReturnValue({}); // Mock collection to return something

    await firestoreLib.someAddFunction({ name: 'test' }, 'userId');

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), { name: 'test', userId: 'userId' });
  });

  // Add more tests for other functions (get, update, delete)
});
```
