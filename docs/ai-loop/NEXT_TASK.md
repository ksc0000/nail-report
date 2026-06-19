```markdown
# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive task is pending. The roadmap clearly outlines a need for unit tests for Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing public exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/utils/test-utils.ts` (new file for Firebase mocking utilities if needed, e.g., for `getFirestore` or `doc` mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except for `vitest.config.ts` if a minimal change is absolutely required for test setup (e.g., adding a test environment, but try to avoid).

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing the public helper functions exported from `src/lib/firestore.ts`.
- Use Vitest for testing and `vi.mock` for mocking Firebase SDK dependencies as needed.
- Ensure tests cover basic CRUD operations or data retrieval logic present in the helpers.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- This file contains unit tests for at least two key helper functions from `src/lib/firestore.ts`.
- Firebase SDK functions (`getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.) are effectively mocked using `vi.mock` to ensure unit isolation.
- `npm test` runs successfully with the new tests passing.

## Required Test Commands

```bash
npm install # Ensure all dependencies are in place
npm run build
npm run lint
npm test
```
```
