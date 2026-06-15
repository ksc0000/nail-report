```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task targets `Phase 2.1 Test coverage`, specifically adding unit tests for Firestore helper functions. The current state indicates that a substantive task is pending, so this is the first concrete task for the AI loop.

## Objective

Implement unit tests for a few key helper functions within `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK dependencies are properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to test; minor refactoring to enable testing is allowed if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any other `src/` files not directly related to `src/lib/firestore.ts` or its tests.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Identify 1-2 core helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getNailItem`, or utility functions that interact with Firestore).
- Write unit tests for these selected functions using Vitest.
- Mock all Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `limit`, `getDoc`) to ensure tests run in isolation without making actual network calls to Firebase.
- Ensure tests cover at least one successful execution path for each chosen function.
- Prefer adding tests for functions that directly encapsulate Firestore operations.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
