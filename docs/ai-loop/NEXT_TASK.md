```markdown
# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task is the first in the "Test coverage" sub-phase, aiming to add foundational unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies appropriately.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to improve testability, if strictly necessary and within line limits)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a `test` script or test-related configuration is required and doesn't add new npm dependencies. Otherwise, assume Vitest is already configured.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file at `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the following functions in `src/lib/firestore.ts`: `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addTag`, `getTags`, `deleteTag`.
- Mock Firebase Firestore SDK calls (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`) using `vitest.mock` or similar Vitest features.
- Ensure tests cover both successful operations and potential error scenarios where applicable for the mocked Firebase calls.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
