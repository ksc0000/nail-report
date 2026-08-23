```markdown
# Worker Prompt Template

## Context

The product roadmap indicates Phase 2 (Improve stability, test coverage, and UX) is active. The first area of focus is 2.1 Test coverage, specifically unit tests for helper functions. The current state shows no substantive tasks have been completed by the AI Loop yet, only setup.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for coverage reporting, if necessary and minimal)

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

Your task is to add comprehensive unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` at the top of your test file to mock Firestore functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc. This will prevent actual database calls during tests.
3.  **Identify functions to test:** Focus on the main CRUD and utility functions related to `nailItems` and `publicShares` within `src/lib/firestore.ts`.
4.  **Write test cases:**
    *   Ensure each function has test cases for successful execution.
    *   Include tests for error handling paths (e.g., what happens if a Firestore operation fails).
    *   Verify that functions correctly interact with the mocked Firebase SDK (e.g., `addDoc` was called with the correct arguments).
5.  **Clean up:** Remove any temporary code, console logs, or unnecessary comments before completing the task.
6.  **Run tests:** Execute `npm test` to ensure all new tests pass.
7.  **Verify lint and build:** Run `npm run lint` and `npm run build` to catch any issues.

Example mocking strategy:

```typescript
// src/__tests__/firestore.test.ts
import { vi } from 'vitest';

// Mock specific Firestore functions
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Import and retain default behavior
    collection: vi.fn(() => ({ type: 'collection-ref' })),
    doc: vi.fn(() => ({ type: 'doc-ref' })),
    getDocs: vi.fn(() => Promise.resolve({
      forEach: (callback) => { /* mock doc data */ }
    })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mockId' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
  };
});

// Now import your firestore helpers
import * as firestoreHelpers from '../lib/firestore';

describe('firestore helpers', () => {
  // Your test cases here
  test('addNailItem should call addDoc with correct data', async () => {
    // ... test implementation
  });
});
```
```
