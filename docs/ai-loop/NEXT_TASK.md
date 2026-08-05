```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 focuses on improving test coverage. The current state shows that no specific test-related tasks have been completed yet from the "Jules-ready Tasks" list. This task will initiate test coverage for Firebase helper functions.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (the file to be tested)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor adjustments are needed for mocking setup, but prefer not to touch)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing at least two core functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems` if they exist).
- Mock Firebase Firestore SDK calls using `vi.mock` to ensure tests are isolated and do not interact with a real Firebase project.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  Create a new test file named `src/__tests__/firestore.test.ts`.
2.  Within `src/__tests__/firestore.test.ts`, set up Vitest to mock the Firebase Firestore SDK. You will need to mock `firebase/firestore` functions like `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc., as needed for the functions you are testing.
3.  Write unit tests for at least two functions from `src/lib/firestore.ts`. Good candidates are functions that handle adding data (e.g., `addNailItem`) and retrieving data (e.g., `getNailItems`), assuming these functions exist in `src/lib/firestore.ts`.
4.  Ensure tests are isolated and only test the logic within `src/lib/firestore.ts`, relying on the mocked Firebase SDK.
5.  Run `npm test` to verify the tests pass.
6.  Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.
```
