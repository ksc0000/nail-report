```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically addresses the `firestore.ts` helpers, establishing the testing infrastructure and initial coverage for critical data operations.

## Objective

Implement unit tests for key functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK to isolate the logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export for testing if necessary, but prefer not to modify implementation)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup requires minor adjustments for mocking)

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

## Worker prompt

Your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest mocking:** Implement mocking for the Firebase Firestore SDK (e.g., `firebase/firestore`). Focus on mocking the necessary functions like `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs` to simulate Firestore interactions without actually hitting the database.
3.  **Write unit tests for at least two core functions in `src/lib/firestore.ts`:**
    *   Good candidates are `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`. Choose two that allow you to demonstrate effective mocking and test basic success paths.
    *   Ensure the tests verify the correct interaction with the mocked Firestore functions (e.g., checking if `addDoc` was called with the expected arguments).
4.  **Do not modify the existing implementation in `src/lib/firestore.ts` unless absolutely necessary for testing (e.g., exporting a function that wasn't exported before, but prioritize avoiding this).**

## Acceptance Criteria

- A new test file `src/__tests__/lib/firestore.test.ts` exists.
- The test file contains mocks for Firebase Firestore SDK.
- At least two functions from `src/lib/firestore.ts` have corresponding unit tests, verifying their logic against the mocked Firestore behavior.
- All tests pass when running `npm test`.

## Required test commands

```bash
npm run build
npm run lint
npm test
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
