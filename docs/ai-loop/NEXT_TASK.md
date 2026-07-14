```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for one or two key helper functions within `src/lib/firestore.ts`, ensuring proper mocking of the Firebase SDK using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but avoid if possible)
- `package.json` (only to add a `test` script if missing, do not add new dependencies)

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

It's time to start adding unit test coverage! Your first task is to write unit tests for a couple of core helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Choose functions to test**: Select one or two simple CRUD helper functions from `src/lib/firestore.ts` that interact with the Firestore SDK (e.g., `addNailItem`, `getNailItems`, `deleteNailItem`, `updateNailItem` or similarly named functions if they exist). Focus on functions that directly call Firestore methods like `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`.
3.  **Mock Firebase SDK**: Use `vi.mock` from Vitest to mock the Firebase Firestore SDK calls. Ensure that the tests do not interact with actual Firebase services.
4.  **Write basic tests**: For the selected functions, write tests to assert:
    *   They call the correct Firestore methods with expected arguments.
    *   They handle successful operations.
    *   They return expected values (e.g., `true` for success, data objects, etc.).
5.  **Run tests**: Make sure the new tests pass using `npm test` (or the equivalent command if it's already defined).

**Example of what a mock might look like (adapt as needed for the specific functions):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { someFirestoreHelperFunction } from '../lib/firestore'; // Replace with actual function

// Mock Firebase
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockQuery = vi.fn();
const mockGetDocs = vi.fn();

vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    collection: mockCollection,
    doc: mockDoc,
    getDoc: mockGetDoc,
    setDoc: mockSetDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    query: mockQuery,
    getDocs: mockGetDocs,
    // Add other necessary mocks like where, orderBy, etc.
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any specific mock return values if needed
    mockDoc.mockReturnValue({ id: 'test-id' }); // Example
    mockCollection.mockReturnValue({});
  });

  // Example test structure (replace with actual function and test logic)
  // it('should add a nail item successfully', async () => {
  //   mockSetDoc.mockResolvedValueOnce(undefined);
  //   const newItem = { name: 'Test Polish', color: 'Red' };
  //   await someFirestoreHelperFunction(newItem); // Replace with actual function call
  //   expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
  //   expect(mockSetDoc).toHaveBeenCalledWith(expect.anything(), newItem);
  // });

  // Add more tests for error cases and other functions
});
```

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- At least one function from `src/lib/firestore.ts` is covered by unit tests.
- The Firebase Firestore SDK is appropriately mocked using `vi.mock`.
- All new tests pass successfully.

**Required Test Commands:**
```bash
npm run test
npm run build
npm run lint
```
```
