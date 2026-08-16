```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task focuses on `2.1 Test coverage`. The project already uses Vitest.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter functionality)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, but avoid major changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two helper functions in `src/lib/firestore.ts`.
- Use Vitest's mocking capabilities for Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`).
- Ensure tests cover basic success and error cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock `firebase/firestore` and any other Firebase SDK dependencies to isolate the functions under test. Focus on mocking the specific methods called by `firestore.ts` helpers (e.g., `getDoc`, `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `collection`, `doc`).
3.  **Choose functions to test**: Select at least two functions from `src/lib/firestore.ts` (e.g., `getNailItem`, `createNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `createPublicShare`, `getPublicShare`).
4.  **Write unit tests**: For each chosen function, write tests covering:
    *   Successful execution with valid data.
    *   Error handling (e.g., what happens if a Firestore operation fails).
    *   Edge cases if applicable (e.g., no data found).
5.  **Run tests**: Execute `npm test` and ensure all tests pass.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to confirm no new issues are introduced.

**Example of mocking Firestore:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Assuming db is exported

// Mock firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Mock firebase/auth if needed by the functions being tested
// vi.mock('firebase/auth');

// Mock the 'db' instance if it's imported directly
vi.mock('../lib/firebase', () => ({
  db: {}, // Mock the db object itself if it's used directly
}));

// Now import your firestore functions to test
import { getNailItem, createNailItem } from '../lib/firestore';

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should fetch a nail item successfully', async () => {
    // Implement test for getNailItem
  });

  it('should create a new nail item successfully', async () => {
    // Implement test for createNailItem
  });

  // Add more tests for other functions
});
```

The goal is to provide basic but effective test coverage for these critical helper functions.
```
