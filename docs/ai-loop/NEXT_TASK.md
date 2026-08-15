```markdown
# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task contributes to the "Test coverage" goal by adding unit tests to a core utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `src/App.css` (only if necessary for test setup, but unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Jules,

Your task is to add unit tests for the functions exported from `src/lib/firestore.ts`.
You should create a new test file, `src/__tests__/firestore.test.ts`, and use Vitest for writing the tests.

Focus on testing the core logic of functions like `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `getNailItemById`, `getPublicShareLink`, `addPublicShareLink`, `deletePublicShareLink`.
You will need to mock Firebase Firestore SDK calls to ensure tests are isolated and do not interact with a live database. Use `vi.mock` for this purpose.

**Acceptance Criteria:**

1.  A new file `src/__tests__/firestore.test.ts` is created.
2.  This file contains unit tests for at least `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` functions from `src/lib/firestore.ts`.
3.  Firebase Firestore SDK dependencies are mocked using `vi.mock` to allow for isolated testing.
4.  All tests pass when running `npm run test`.
5.  `npm run build` completes without errors.
6.  `npm run lint` completes without errors.

**Implementation Notes:**

-   Mock the `firebase/firestore` module to control the behavior of Firestore methods (e.g., `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`).
-   Consider testing edge cases such as empty data or error paths for future iterations, but for this task, focus on successful operations.
-   Start with a few key functions to keep the diff small.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`).
```
