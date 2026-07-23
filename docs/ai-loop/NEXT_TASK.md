# Worker Prompt Template

## Context

The current phase of the `nail-report` application development focuses on improving stability, test coverage, and user experience. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to test the logic within these functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but primarily testing existing exports)
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (if Vitest setup is incomplete, minimal changes only)
- `package.json` (only to add a `test` script if missing, no new npm dependencies)

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
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock necessary Firebase/Firestore SDK functions (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `collection`).
- Write at least 2-3 unit tests for key functions in `src/lib/firestore.ts` (e.g., `getNailItem`, `addNailItem`, `deleteNailItem`). Focus on the happy path for now.
- Ensure the tests pass.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Create Test File:** Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Vitest Setup (if necessary):** Verify `vitest` is set up. If there isn't a `test` script in `package.json`, add `"test": "vitest"` to the `"scripts"` section.
3.  **Mock Firebase SDK:** Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the `@firebase/firestore` module. This mock should provide dummy implementations for functions like `doc`, `collection`, `getDoc`, `addDoc`, `updateDoc`, and `deleteDoc` that are called by `src/lib/firestore.ts` functions.
    *   For `getDoc`, ensure it can return a mock `DocumentSnapshot` object with a `data()` method.
    *   For `addDoc`, `updateDoc`, `deleteDoc`, they can be simple `vi.fn()` mocks that resolve successfully.
    *   `doc` and `collection` can return simple mock objects with methods like `id`.
4.  **Write Unit Tests:**
    *   Implement a test suite using `describe` for `src/lib/firestore.ts`.
    *   Write unit tests for at least two of the following functions in `src/lib/firestore.ts`: `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `updatePublicShare`.
    *   For example, a test for `getNailItem` should verify it correctly calls `getDoc` and processes the returned data. A test for `addNailItem` should verify it calls `addDoc` with the correct arguments.
5.  **Run Tests:** Execute `npm test` (or `npm run test` if a custom script).
6.  **Verify Build and Lint:** Run `npm run build && npm run lint` to ensure no new errors are introduced.

**Example Mock Structure Hint:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { doc, collection, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import real types for mocking if needed
// Or mock directly:
// vi.mock('firebase/firestore', () => ({
//   doc: vi.fn(() => ({ id: 'mockDocId' })),
//   collection: vi.fn(() => ({ id: 'mockCollectionId' })),
//   getDoc: vi.fn(() => Promise.resolve({
//     exists: vi.fn(() => true),
//     data: vi.fn(() => ({ someField: 'someValue' })),
//     id: 'mockDocId',
//   })),
//   addDoc: vi.fn(() => Promise.resolve({ id: 'newMockDocId' })),
//   updateDoc: vi.fn(() => Promise.resolve()),
//   deleteDoc: vi.fn(() => Promise.resolve()),
// }));

// import { getNailItem, addNailItem } from '../lib/firestore'; // Your actual functions
```
