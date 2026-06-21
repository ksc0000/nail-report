```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding foundational unit tests for our Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Mock the Firebase SDK as needed to isolate tests.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only to add `vitest` scripts if not already present, but no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, but typically not for basic setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval beyond initial Vitest setup if not present)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Focus on testing the primary CRUD operations (add, get, update, delete) for `nailItems` and `publicShares` within `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`) to ensure tests are isolated and do not interact with a live Firebase project.
- Aim for basic happy-path testing for each function. Error handling tests can be a follow-up task.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest**: Ensure `npm test` runs Vitest. If `vitest` is not already configured in `package.json` scripts, add `"test": "vitest"` (check if it exists first).
3.  **Mock Firebase SDK**: Utilize `vi.mock` to mock Firestore functions. For example:
    ```typescript
    import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs } from 'firebase/firestore';

    vi.mock('firebase/firestore', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        getFirestore: vi.fn(() => ({})), // Mock getFirestore
        collection: vi.fn(() => ({})), // Mock collection
        doc: vi.fn(() => ({})), // Mock doc
        addDoc: vi.fn(() => Promise.resolve({ id: 'mockId' })),
        updateDoc: vi.fn(() => Promise.resolve()),
        deleteDoc: vi.fn(() => Promise.resolve()),
        getDoc: vi.fn(() => Promise.resolve({ exists: () => true, data: () => ({ /* mock data */ }) })),
        getDocs: vi.fn(() => Promise.resolve({ forEach: (cb) => cb({ id: 'mockId1', data: () => ({ /* mock data */ }) }) })),
        query: vi.fn(() => ({})), // Mock query
        where: vi.fn(() => ({})), // Mock where
      };
    });
    ```
4.  **Write Tests**: Implement tests for the following functions in `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItems`
    *   `getNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `addPublicShare`
    *   `deletePublicShare`
5.  **Run Checks**: Before completing, ensure `npm run build && npm run lint && npm test` pass.
```
