# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX. This task addresses the "Test coverage" aspect by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/` (create new test files as needed, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (only if absolutely necessary for test setup, but unlikely for this task)
- `package.json` (only to add a `test` script if not present, but *not* to add new `dependencies` or `devDependencies` beyond what is implicitly allowed by the roadmap's mention of Vitest)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (no new npm `dependencies` or `devDependencies` that are not explicitly part of the Vitest setup, which is assumed to be allowed/present per roadmap)
- Firebase deploy commands
- Secrets and credentials
- `src/lib/auth.ts`, `src/lib/storage.ts`, `src/lib/publicShares.ts` (do not modify these files or add tests for them in this task)

## Requirements

- Keep diff ≤ 150 lines.
- Write unit tests for all public functions within `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies as necessary using Vitest's mocking capabilities.
- Ensure tests cover typical use cases, including successful operations and potential error conditions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or equivalent Vitest command) to ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Set up Vitest (if not already present):** Verify if Vitest is configured. If `npm test` does not work, attempt to configure `package.json` scripts for Vitest, assuming `vitest` is available as a dev dependency based on the roadmap. *Do not install new npm packages unless `vitest` is explicitly missing from `devDependencies` and its installation is critical to proceed with testing according to the roadmap (if so, report this as a follow-up item).*
2.  **Create a test file:** Create `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase:** Use `vi.mock` to mock `firebase/firestore` and other Firebase SDK dependencies to isolate the `firestore.ts` functions during testing.
4.  **Write tests:**
    *   Write `describe` blocks for logical groupings of tests.
    *   Write `it` blocks for individual test cases.
    *   Ensure coverage for functions like `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShareLink`, `addPublicShare`, `deletePublicShare`, etc., as they are present in `src/lib/firestore.ts`.
    *   Include tests for both successful operations and expected error handling (e.g., what happens if a Firestore call fails).
5.  **Run tests:** Execute your tests using the appropriate Vitest command (e.g., `npm test` or `vitest`).
6.  **Verify lint and build:** Run `npm run lint` and `npm run build`.

**Example mocking approach:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Assuming db is exported

// Mock firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDoc: vi.fn(),
  };
});

// Mock firebase.ts or direct db export if necessary
vi.mock('../lib/firebase', () => ({
  db: {}, // Mock the db object
}));

describe('firestore.ts helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Example test for getNailItems
  it('should fetch nail items for a user', async () => {
    // Implement test logic, mock getDocs return value
  });

  // Add tests for other functions
});
```
