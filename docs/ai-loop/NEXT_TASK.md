```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding unit tests for core Firestore helper functions to ensure their reliability.

## Objective

Implement Vitest unit tests for the `nailItems` CRUD helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability if strictly necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to confirm `vitest` scripts, no new dependencies)

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

Implement unit tests for the Firestore helper functions related to `nailItems` in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Focus on `nailItems` CRUD functions:** Write tests for `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
3.  **Mock Firebase SDK:** Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
4.  **Test successful operations:** Ensure functions correctly interact with the mocked Firestore and return expected results.
5.  **Consider edge cases/error paths (if easily testable with mocking):** For instance, ensure `getNailItems` handles an empty collection.
6.  **Run tests:** Ensure `npm test` passes for the newly created tests.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- The file contains Vitest unit tests for `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` from `src/lib/firestore.ts`.
- Firebase SDK calls are appropriately mocked.
- All new tests pass successfully when `npm test` is run.

**Required Test Commands:**
```bash
npm install
npm run build
npm run lint
npm test # Ensure new tests pass
```

**Example of mocking Firestore (for reference):**
```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, getFirestore, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { addNailItem, getNailItems, updateNailItem, deleteNailItem } from '../lib/firestore'; // Your actual file

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a dummy object
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

describe('Firestore Nail Item Helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('addNailItem should add a new nail item', async () => {
    // Mock the return value of addDoc
    (addDoc as vi.Mock).mockResolvedValueOnce({ id: 'new-id' });
    (collection as vi.Mock).mockReturnValueOnce({}); // Mock collection to return a dummy

    const item = { userId: 'user123', date: '2023-01-01', notes: 'Test', imageUrl: '' };
    const result = await addNailItem(item);

    expect(addDoc).toHaveBeenCalledWith(expect.any(Object), item);
    expect(result).toEqual('new-id');
  });

  // Add more tests for getNailItems, updateNailItem, deleteNailItem
});
```

```
```
