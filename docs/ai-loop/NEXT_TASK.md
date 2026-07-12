# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, ensuring proper mocking of Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested)
- `src/__tests__/` (specifically, create a new file `src/__tests__/lib/firestore.test.ts`)

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

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Select functions**: Choose one or two *simple* helper functions from `src/lib/firestore.ts` (e.g., functions wrapping `addDoc`, `getDoc`, `updateDoc`, or `deleteDoc`). Prioritize functions with clear input/output and minimal side effects for the initial tests.
3.  **Implement tests**: Write unit tests for the selected functions using Vitest.
4.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK functions (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with a live Firebase instance. Simulate successful and potentially error conditions if feasible within the line limit.
5.  **Assertions**: Use Vitest's assertion library (`expect`) to verify the behavior of the helper functions.
6.  **Maintain line limit**: Focus on thorough testing of a small number of functions rather than shallow testing of many, to stay within the ≤150 line diff limit.

**Example of mocking Firebase Firestore:**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import only what's needed for types/mocks

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Spread actual to not mock everything
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    doc: vi.fn((firestore, path, docId) => ({
      // Mock doc reference to have a simple path
      path: `${path}/${docId}`,
      id: docId,
    })),
    collection: vi.fn((firestore, path) => ({
      path: path,
    })),
    // Mock other Firestore functions as needed (e.g., addDoc, updateDoc, deleteDoc)
  };
});

// Import the function you want to test from your firestore.ts file
// import { yourFirestoreHelperFunction } from '../../lib/firestore';

describe('firestore.ts helper functions', () => {
  // Test cases go here
  it('should call getDoc when fetching a document', async () => {
    // Cast the mocked function to ensure type safety if needed
    const mockedGetDoc = getDoc as vi.Mock;
    mockedGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Test Item' }),
    });

    // const result = await yourFirestoreHelperFunction('testId');
    // expect(mockedGetDoc).toHaveBeenCalledWith(expect.anything());
    // expect(result).toEqual({ name: 'Test Item' });
  });

  // Add more tests for other scenarios and functions
});
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
