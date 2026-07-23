```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task contributes to improving test coverage by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, specifically focusing on mocking Firebase Firestore interactions to ensure tests are isolated and efficient.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or adding types)
- `src/__tests__/` (new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration for mocking needs adjustment)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying CSS files unless directly related to the test setup (unlikely for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- **Acceptance Criteria:**
    - Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
    - Implement mocking for the Firebase Firestore SDK using `vi.mock` to prevent actual Firebase calls during tests.
    - Write at least two unit tests for different functions within `src/lib/firestore.ts`.
    - Each test should verify the expected behavior of a function by asserting against mocked Firestore methods' calls or return values.
    - Ensure tests pass when run with `npm run test`.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for functions within `src/lib/firestore.ts`.

1.  **Create Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore:** Implement `vi.mock` to mock the necessary Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`). The goal is to isolate `firestore.ts` logic from actual Firebase backend interactions.
3.  **Identify Functions to Test:** Choose at least two representative functions from `src/lib/firestore.ts` that interact with Firestore (e.g., `addItem`, `getItem`, `updateItem`, `deleteItem`, `addPublicShare`, `getPublicShare`).
4.  **Write Unit Tests:** For each chosen function:
    *   Write a unit test case that calls the function.
    *   Assert that the mocked Firestore methods are called with the expected arguments.
    *   Verify that the function returns the expected value or handles errors correctly, based on your mocked responses.
    *   Focus on basic success path tests first.

**Example Mocking Approach (conceptual):**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
// Import the functions you want to test from src/lib/firestore.ts

// Mock Firebase app and firestore
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a mock object
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    // Add any other Firestore methods used in firestore.ts that need mocking
  };
});

// ... your tests
```

Remember to run `npm run test` to verify your tests pass and `npm run build && npm run lint` before finalizing.
```
