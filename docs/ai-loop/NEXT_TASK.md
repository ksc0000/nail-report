# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" objective by adding unit tests for existing helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if necessary for testability, e.g., exporting non-exported functions if truly required, but prefer not to change implementation code)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer not to touch)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, or any UI components

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` logic.
- Ensure test coverage for core functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Run `npm run test`, `npm run build`, and `npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create Test File**: Create a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase**: Within this test file, use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). This is crucial to prevent actual database calls during tests and to control the behavior of Firebase functions.
3.  **Test Functions**: Write unit tests for the public helper functions exported from `src/lib/firestore.ts`. Focus on ensuring they correctly interact with the mocked Firebase SDK and handle input/output as expected. Examples include:
    *   `getNailItems`: Test its behavior with mocked `collection`, `query`, `getDocs`, etc.
    *   `addNailItem`: Test how it calls `addDoc` with the correct data.
    *   `updateNailItem`: Test how it calls `updateDoc` with the correct ID and data.
    *   `deleteNailItem`: Test how it calls `deleteDoc` with the correct ID.
4.  **Assertions**: Use Vitest's `expect` and mock functions' `toHaveBeenCalledWith` to verify interactions with the mocked Firebase methods.
5.  **Run Tests**: Execute `npm run test` to confirm your tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks by running `npm run build && npm run lint`.
