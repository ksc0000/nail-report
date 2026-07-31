```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task addresses the "Test coverage" objective by adding unit tests for core helper functions. Vitest is the designated test runner, and Firebase SDK mocking will be required.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts`. Focus on mocking Firebase SDK calls using `vi.mock` to ensure tests are isolated and efficient.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to change logic directly)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if a `test` script specifically for `vitest` needs to be added or modified, but *no new npm dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be installed and configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to prevent actual Firebase calls.
- Cover at least 2-3 key helper functions in `src/lib/firestore.ts` with basic CRUD scenarios (e.g., `getNailItems`, `addNailItem`, `updateNailItem`).
- Ensure tests are clean, readable, and follow Vitest best practices.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add a file like `src/__tests__/firestore.test.ts`.
2.  **Configure Mocks:** Within this test file, use `vi.mock` to mock the necessary Firebase SDK functions (e.g., from `firebase/firestore`) that are used within `src/lib/firestore.ts`. This is crucial for isolating tests from actual Firebase interactions.
3.  **Write Tests:** Implement unit tests for at least 2-3 significant helper functions in `src/lib/firestore.ts`. Focus on functions that interact with Firestore for CRUD operations, such as fetching items, adding new items, updating, or deleting.
4.  **Assertions:** Use Vitest's assertion library to verify the behavior of these functions, checking that they call the correct mocked Firebase methods with the expected arguments and return the anticipated results.
5.  **Run Checks:** Before completing the task, ensure `npm run build` and `npm run lint` pass without errors.
```
