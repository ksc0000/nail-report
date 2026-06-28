```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for a core utility file.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. The goal is to ensure the reliability and correctness of the Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if needed for testability, but focus is on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only for adding `test` script if not already present, no new dependencies)
- `vite.config.ts` (only for Vitest configuration if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, `vitest` should already be configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK functions used by `src/lib/firestore.ts` (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock`.
- Write unit tests covering the primary functions in `src/lib/firestore.ts` (e.g., `getAllNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `updatePublicShare`).
- Aim for good test coverage for the functions within `firestore.ts`.
- Run `npm test` to ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

**Worker prompt:**

Implement unit tests for the functions in `src/lib/firestore.ts` using Vitest.

1.  Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  Set up Vitest mocking for the Firebase SDK's `firestore` module to control its behavior in tests. Specifically, mock functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `limit`, and `getDoc`.
3.  Write test cases for each public helper function in `src/lib/firestore.ts`, such as `getAllNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, and `updatePublicShare`.
4.  Ensure tests cover successful operations and, where applicable, potential error paths.
5.  Verify that `npm test` passes and that code coverage for `src/lib/firestore.ts` has significantly improved.
6.  Ensure the solution respects the line diff limit and does not introduce new npm dependencies.

Example of Firebase mock setup (adjust as needed for specific functions used in `firestore.ts`):

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, limit, getDoc } from 'firebase/firestore';

// Mock the entire 'firebase/firestore' module
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
    limit: vi.fn(),
    getDoc: vi.fn(),
    // Add other functions used in firestore.ts that need mocking
  };
});

// ... your tests
```
```
