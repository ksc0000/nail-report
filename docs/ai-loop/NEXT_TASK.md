```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The current state shows that Vitest has been chosen as the test runner, and the next logical step is to begin implementing unit tests for core application logic. This task aligns with Phase 2.1 "Test coverage".

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__mocks__/` (for Firebase SDK mocks, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files or folders not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least one key function from `src/lib/firestore.ts`, such as `addItem`, `updateItem`, or `deleteItem`.
- Mock Firebase Firestore SDK calls (e.g., `collection`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`) using `vi.mock` to ensure tests are isolated and do not interact with a live Firebase project.
- Assert that the functions are called with the correct arguments or return the expected values.
- Ensure all tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
