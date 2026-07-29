# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task addresses Phase 2.1, specifically adding unit tests for critical utility functions.

## Objective

Add unit tests using Vitest for the helper functions in `src/lib/firestore.ts`. Focus on basic CRUD operations and data marshalling functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily for understanding functionality)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if necessary for mocking Firebase SDK, though this might be a follow-up task if complex)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least 3-5 key helper functions within `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or data conversion functions.
- Use `vitest` for testing and `vi.mock` to mock Firebase SDK dependencies (Firestore functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
- Ensure tests run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the helper functions found in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest mocks**: Within `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` depends on. This is crucial for isolating the functions under test from actual Firebase calls. You will need to mock `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, and potentially `query`, `where` if used in the helpers.
    *   For example, you might mock `getDocs` to return a predefined snapshot with specific data, or `addDoc` to resolve with a mock document reference.
3.  **Write unit tests**: Implement unit tests for a selection of core functions in `src/lib/firestore.ts`. Focus on functions that perform CRUD operations or data transformation. Good candidates include:
    *   `getNailItems`: Test if it correctly retrieves and formats data from a mocked Firestore snapshot.
    *   `addNailItem`: Test if it correctly calls the mocked `addDoc` with the provided data.
    *   `updateNailItem`: Test if it correctly calls the mocked `updateDoc` for a given item ID.
    *   `deleteNailItem`: Test if it correctly calls the mocked `deleteDoc` for a given item ID.
    *   Ensure each test asserts the expected behavior, such as return values, side effects (e.g., mock function calls), or error handling.
4.  **Run tests**: Execute `npm test` and ensure all new tests pass.
5.  **Lint and build**: Run `npm run build && npm run lint` to verify code quality and build success.
6.  **Adhere to limitations**: Do not modify `src/main.tsx` or any Firebase rules. Do not add new npm dependencies. Keep the total diff small (under 150 lines).
