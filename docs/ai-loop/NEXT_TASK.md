```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key goal in this phase is to add unit tests for the core Firebase helper functions. This task specifically targets the Firestore helper functions to improve test coverage and stability.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest. The initial focus should be on testing basic CRUD operations such as adding and retrieving items, ensuring proper interaction with the mocked Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (read-only for understanding functions)
- `src/__tests__/firestore.test.ts` (create this new file for tests)
- `src/App.css` (only if absolutely necessary for test setup, highly unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Use `vitest` for testing and `vi.mock('firebase/firestore')` to mock Firebase SDK calls.
- Write tests for at least the `addItem` and `getItem` functions from `src/lib/firestore.ts`.
- Ensure mocks accurately simulate successful Firebase operations.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocking:** Mock the `firebase/firestore` module to control its behavior during tests. You will likely need to mock functions like `doc`, `collection`, `getDoc`, `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`.
3.  **Write tests for `addItem`:**
    *   Test that `addItem` successfully calls the mocked `addDoc` with the correct collection and data.
    *   Verify it returns the expected data, possibly including a generated ID from the mock.
4.  **Write tests for `getItem`:**
    *   Test that `getItem` correctly calls the mocked `doc` and `getDoc`.
    *   Ensure it retrieves and processes the mocked document snapshot correctly, including handling non-existent documents.
5.  **Run checks:** Execute `npm run build && npm run lint` and ensure there are no errors.

Focus on creating robust mocks that allow you to test the logic within `src/lib/firestore.ts` in isolation, without making actual calls to Firebase.
```
