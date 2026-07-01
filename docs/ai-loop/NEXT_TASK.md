```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. A key objective for this phase is to improve test coverage for critical application logic.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This task focuses on establishing initial test coverage for the Firestore interaction logic.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but Vitest should largely be configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- **Create a new test file:** `src/__tests__/firestore.test.ts`
- **Focus on key helper functions:** Write unit tests for at least two core CRUD/query functions in `src/lib/firestore.ts`, such as `getNailItem`, `createNailItem`, `updateNailItem`, or `deleteNailItem`.
- **Mock Firebase SDK:** Ensure the Firebase SDK calls within `src/lib/firestore.ts` are properly mocked using `vi.mock` to avoid actual database interactions during tests.
- **Use Vitest assertions:** Write clear and concise tests using Vitest's assertion library.
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

Your task is to add unit tests for `src/lib/firestore.ts`.

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Inside this file, import the functions from `src/lib/firestore.ts` that you intend to test.
3.  Implement mocking for the Firebase SDK's `firestore` module using `vi.mock('@firebase/firestore')` (or the specific Firebase client import used) to prevent real database calls. Mock the necessary methods (e.g., `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `collection`, `query`, `onSnapshot`) to return controlled values or to assert that they were called correctly.
4.  Write at least two `describe` blocks, each containing unit tests for two distinct helper functions from `src/lib/firestore.ts`. For example, one block for `createNailItem` and another for `getNailItem`.
5.  Ensure tests cover basic success cases and potential error scenarios if applicable and easily mockable.
6.  Run `npm test` to confirm your new tests pass.
7.  Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

**Example of mocking pattern (adapt as necessary based on actual Firebase imports):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Adjust path

// Mock Firebase Firestore SDK
vi.mock('@firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@firebase/firestore')>();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if it's called directly
    doc: vi.fn((db, path, id) => ({ __path__: `${path}/${id}` })),
    collection: vi.fn((db, path) => ({ __path__: path })),
    getDoc: vi.fn(() => Promise.resolve({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ /* mock data */ })),
      id: 'testId'
    })),
    setDoc: vi.fn(() => Promise.resolve()),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    // Add other mocks as needed (query, onSnapshot, etc.)
  };
});

describe('createNailItem', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should create a new nail item successfully', async () => {
    // Call the function under test
    const newItem = { /* test data */ };
    // Assertions using expect and vi.mocked().toBeCalledWith()
    await firestoreLib.createNailItem('userId', newItem);
    expect(vi.mocked(require('@firebase/firestore').setDoc)).toHaveBeenCalledWith(
      expect.objectContaining({ __path__: 'users/userId/nailItems/someId' }), // Adjust mock return for doc to match
      expect.objectContaining(newItem)
    );
  });
});
```
```
