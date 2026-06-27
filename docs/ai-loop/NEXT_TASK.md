# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX. The current state shows that core setup is complete, and the next steps involve implementing specific improvements from Phase 2. This task focuses on improving test coverage for critical utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor adjustments for mocking Firebase SDK, if not already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components (this task is focused on lib tests)

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for the exported functions in `src/lib/firestore.ts`.
- Focus on mocking Firebase SDK interactions (Firestore, Auth) using `vi.mock` to ensure tests are isolated and fast.
- Aim for good test coverage (e.g., branch and statement coverage) for the functions being tested.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** In the `src/__tests__/` directory, create a new file named `firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vi.mock` to mock the Firebase Firestore and potentially Auth SDKs to prevent actual database calls during testing. For example, mock `firebase/firestore` and its methods (`getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `collection`, etc.) to return predictable values or throw errors as needed for specific test cases.
3.  **Identify functions to test:** Focus on all exported helper functions within `src/lib/firestore.ts`.
4.  **Write test cases:**
    *   For each function, write multiple test cases covering successful operations, edge cases (e.g., empty inputs if applicable), and error handling scenarios.
    *   Ensure that the tests assert the correct data transformations, function calls to the mocked SDK, and returned values.
5.  **Run tests:** Execute `npm test` to verify all tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure code quality and project integrity.

Example of a test structure (conceptual):

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import all exports

// Mock Firebase Firestore SDK
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDocs: vi.fn(() => ({ docs: [] })),
  addDoc: vi.fn(() => ({ id: 'new-id' })),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
}));

describe('firestoreLib', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should fetch all nail items successfully', async () => {
    // Mock specific return values for this test
    // expect(await firestoreLib.getNailItems(mockUserId)).toEqual([]);
  });

  it('should handle errors when fetching nail items', async () => {
    // Mock getDocs to throw an error
    // await expect(firestoreLib.getNailItems(mockUserId)).rejects.toThrow('...');
  });

  // Add tests for other functions like addNailItem, updateNailItem, deleteNailItem, etc.
});
```
