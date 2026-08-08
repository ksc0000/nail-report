# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for a core utility file. Vitest is the chosen test runner, and the Firebase SDK should be mocked for isolated testing.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing existing logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if absolutely necessary to add a `test` script entry for Vitest, but *without* adding new dependencies. Assume Vitest is already installed as a dev dependency.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or adding *new* `devDependencies` (without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory (except for `package.json` if explicitly for the `test` script)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `firebase/firestore` functions) using `vi.mock()` to isolate `firestore.ts` logic.
- Cover common CRUD operations (add, get, update, delete) if present in `firestore.ts`.
- Ensure tests are robust and handle potential edge cases (e.g., empty data, error scenarios if logic is present).
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add comprehensive unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** In the `src/__tests__/` directory, create `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the `firebase/firestore` module and any other Firebase services that `src/lib/firestore.ts` directly interacts with. For example, mock `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` as needed. The mocks should return predictable values or throw errors to test different scenarios.
3.  **Write tests for `src/lib/firestore.ts`:**
    *   Identify all exported functions in `src/lib/firestore.ts` that interact with Firestore.
    *   For each function, write one or more test cases.
    *   Test successful operations (e.g., adding an item, retrieving items).
    *   Test error handling scenarios (e.g., what happens if a Firestore operation fails, if such logic is present in `firestore.ts`).
    *   Use `expect` assertions to verify the behavior and return values of the functions.
4.  **Verify Vitest setup:** Ensure `npm test` successfully runs your new tests. If `vitest` is not already configured as the `test` script in `package.json`, *add* `"test": "vitest"` to the `scripts` section. Do *not* add `vitest` as a new dependency if it's not already present; report this as a blocker if `vitest` is truly missing.
5.  **Run checks:** Before submitting, execute `npm run build && npm run lint && npm test`.

This task focuses solely on `src/lib/firestore.ts` and its direct dependencies on Firebase SDK mocks. Do not implement any new features or modify the UI.

**Example of mocking Firebase/firestore (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import the module to be tested

// Mock the firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...original,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => 'mockCollectionRef'), // Mock collection
    doc: vi.fn(() => 'mockDocRef'), // Mock doc
    getDocs: vi.fn(() => ({
      docs: [
        { id: '1', data: () => ({ name: 'Item 1' }) },
        { id: '2', data: () => ({ name: 'Item 2' }) },
      ],
    })),
    addDoc: vi.fn(async (collectionRef, data) => ({ id: 'newId', ...data })),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    // Add other mocks for Firestore functions as needed
  };
});

// Example test structure
describe('firestoreLib', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should fetch nail items correctly', async () => {
    // Test the function that calls getDocs
    const items = await firestoreLib.getNailItems('userId');
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Item 1');
  });

  // Add more tests for other functions (addNailItem, updateNailItem, deleteNailItem, etc.)
});
```
