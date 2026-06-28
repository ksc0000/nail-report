# Worker Prompt Template

## Context

The current focus is Phase 2 of the roadmap, specifically improving stability and test coverage. This task aims to increase unit test coverage for core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if minor configuration for mocking is absolutely required, but prefer existing setup)

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
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

### Task: Add Vitest unit tests for `src/lib/firestore.ts` helper functions

Implement unit tests for the utility functions in `src/lib/firestore.ts` using Vitest.

1.  **Create Test File**: Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore**: Use `vi.mock('firebase/firestore')` to mock the necessary functions from the Firebase Firestore SDK (e.g., `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`).
    *   Set up mock implementations to return predictable values or throw errors to test different scenarios.
3.  **Implement Tests**: Write unit tests for at least **two** distinct helper functions from `src/lib/firestore.ts`. Focus on common CRUD operations like adding, getting, or updating documents.
    *   Verify that the helper functions correctly call the mocked Firebase Firestore SDK methods with the expected arguments.
    *   Test both successful execution paths and error handling paths (e.g., what happens if a mocked Firebase function throws an error).
4.  **Assumptions**: Assume Vitest is already configured in the project and `vi.mock` works as expected for mocking Firebase modules.

### Acceptance Criteria

- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains `describe` blocks and `it` tests.
- At least two functions from `src/lib/firestore.ts` are covered by unit tests.
- The tests mock the Firebase Firestore SDK to isolate `src/lib/firestore.ts` logic.
- `npm test` runs successfully with the new tests passing.

### Required Test Commands

```bash
npm run build
npm run lint
npm test
```
