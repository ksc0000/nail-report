```markdown
# Worker Prompt Template

## Context

The current phase is "2.1 Test coverage" of the product roadmap. The goal is to improve stability and test coverage. This task focuses on adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking the Firebase SDK correctly to ensure tests are isolated and efficient.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily focused on testing it)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (if Vitest configuration for mocking needs adjustment)
- `package.json` (only to add a `test` script if missing, no new dependencies)

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
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock the Firebase SDK (`firebase/firestore`) to test `src/lib/firestore.ts` functions in isolation.
- Write at least two unit tests for distinct helper functions within `src/lib/firestore.ts`. For example, test a function that adds a document and another that fetches a document or collection.
- Ensure tests run successfully with `npm run test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
## Worker Prompt

Hey Jules,

Your next task is to add unit tests for the `src/lib/firestore.ts` helper functions. This is a crucial step in improving the stability of `nail-report`.

**Specific steps:**

1.  **Create a new test file:** Add `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest mocking:** Configure Vitest to mock the `firebase/firestore` module. This is essential for isolated unit testing, preventing actual calls to Firebase during tests. You'll likely use `vi.mock` from Vitest.
3.  **Identify functions to test:** Open `src/lib/firestore.ts` and identify at least two key helper functions that interact with Firestore (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `getNailItems` or similar functions that handle CRUD operations for `nailItems`).
4.  **Write unit tests:** For each identified function, write one or more unit tests.
    *   Ensure the tests assert the expected behavior of the helper function, checking if Firebase methods (like `addDoc`, `getDoc`, `updateDoc`, `getDocs`, etc.) are called with the correct arguments and that the function returns the expected data or handles errors properly.
    *   Use mock return values for the mocked Firebase functions to simulate successful operations and potential failures.
5.  **Verify test execution:** Run `npm run test` and ensure all new tests pass.
6.  **Lint and build:** Run `npm run build && npm run lint` to ensure no linting or build issues are introduced.

**Example of mocking (adapt as needed for `src/lib/firestore.ts`):**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore'; // Import actual Firebase functions to mock them

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual, // Use actual implementations for anything not explicitly mocked
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({
      // Mock collection reference
      withConverter: vi.fn(() => ({
        id: 'mock-collection-ref',
      })),
      id: 'mock-collection-ref',
    })),
    doc: vi.fn((firestore, path, id) => ({
      path: `${path}/${id}`,
      id: id,
      // Add other properties typically found on a DocumentReference
    })),
    addDoc: vi.fn(async (colRef, data) => ({
      id: 'mock-new-doc-id',
      // Add other properties typically found on a DocumentReference
    })),
    getDoc: vi.fn(async (docRef) => ({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ id: docRef.id, ...MOCK_ITEM_DATA })),
      id: docRef.id,
    })),
    getDocs: vi.fn(async (colRef) => ({
      docs: [{
        id: 'mock-doc1-id',
        exists: vi.fn(() => true),
        data: vi.fn(() => ({ /* mock data */ })),
      }, {
        id: 'mock-doc2-id',
        exists: vi.fn(() => true),
        data: vi.fn(() => ({ /* mock data */ })),
      }],
      empty: false,
    })),
    // Mock other Firestore functions as needed (e.g., updateDoc, deleteDoc, query)
  };
});

// Now, import the functions from src/lib/firestore.ts and test them
// import { addNailItem, getNailItem } from '../lib/firestore'; // Adjust path
// ... your tests
```

Good luck!
```
