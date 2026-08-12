```markdown
# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability and test coverage. This task specifically targets adding unit tests for core Firebase utility functions. Vitest is the chosen test runner, and Firebase SDK mocking will be required.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mock Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primary focus is test files)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor modifications for mock setup if strictly necessary, but prefer setup in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except `vitest.config.ts` if strictly needed.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Setup Vitest and Firebase mocking**:
    *   You will need to mock the Firebase Firestore SDK to prevent actual database calls during tests. Use `vi.mock('firebase/firestore')` and provide mock implementations for functions like `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, and `deleteDoc`.
    *   Ensure the mocks return predictable data or resolve/reject promises as needed for test scenarios.
3.  **Test helper functions**:
    *   Focus on at least 2-3 key helper functions from `src/lib/firestore.ts`, such as `getItem`, `createItem`, `updateItem`, or `deleteItem`.
    *   Write test cases for successful operations (e.g., `createItem` adds a new document, `getItem` retrieves data).
    *   Consider edge cases like item not found for `getItem` or error scenarios where Firebase operations might fail (though extensive error testing can be a follow-up).
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify the behavior of the helper functions, checking returned values, mock calls, or thrown errors.
5.  **Clean up**: Ensure tests are self-contained and don't leave side effects.
6.  **Code quality**: Adhere to existing coding styles, linting rules, and type safety.

### Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The Firebase Firestore SDK is mocked effectively within the test file(s).
- At least 2-3 helper functions from `src/lib/firestore.ts` have unit tests covering successful execution paths.
- All tests pass when running `npm run test`.
- The code passes `npm run lint` and `npm run build`.

### Required Test Commands

```bash
npm run test
npm run lint
npm run build
```
```
