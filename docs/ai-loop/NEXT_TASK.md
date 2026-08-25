# Worker Prompt Template

## Context

The product roadmap indicates Phase 2, focusing on stability, test coverage, and UX, is currently active. The immediate objective is to improve test coverage, starting with core utility functions. This task specifically targets adding unit tests for Firebase Firestore helper functions.

## Objective

Implement Vitest unit tests for a few core helper functions within `src/lib/firestore.ts`, focusing on mocking Firebase Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `src/__tests__/` (other new test files, if needed for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Add tests when touching `src/lib/` files (this is the primary objective).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for a subset of the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocking**: Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase Firestore SDK interactions. You will need to mock the `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, and `deleteDoc` functions as necessary, to prevent actual database calls during tests.
3.  **Implement unit tests**: Write unit tests for at least two core CRUD helper functions in `src/lib/firestore.ts`. Focus on functions like `createNailItem` and `getNailItems` to demonstrate successful item creation and retrieval.
    *   For `createNailItem`, test that it correctly calls `addDoc` with the expected collection reference and data.
    *   For `getNailItems`, test that it correctly calls `getDocs` and transforms the snapshot data into the expected array of nail items.
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify that the functions behave as expected, and that the mocked Firestore methods are called with the correct arguments.
5.  **Error Handling (Optional but recommended for selected functions)**: If possible within the line limit, consider adding a basic test case for an error scenario (e.g., if a mocked `addDoc` throws an error).

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least two passing unit tests for `src/lib/firestore.ts` helper functions (`createNailItem` and `getNailItems` are good starting points).
- Firebase Firestore SDK interactions are properly mocked.
- All tests pass when running `npm run test`.
- The code passes linting and builds successfully.

## Required Test Commands

```bash
npm run test
npm run build
npm run lint
```

## Suggested next task

Add `aria-label` to all icon-only buttons.
