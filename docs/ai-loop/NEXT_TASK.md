```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage as part of Phase 2.1 of the roadmap. The `src/lib/firestore.ts` file contains critical helper functions for interacting with Firebase Firestore. Adding unit tests for these functions will enhance stability and ensure their correct behavior.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on key CRUD operations or data transformation functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing existing exports)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__/lib/test-utils.ts` (new file for Firebase mocking utilities, if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Ensure tests cover at least two distinct helper functions in `src/lib/firestore.ts`.
- Run `npm run test`, `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a test file**: Add a new test file, `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vitest` and `vi.mock` to mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). You may create a `src/__tests__/lib/test-utils.ts` file for reusable mocking utilities if appropriate.
3.  **Write unit tests**: Focus on testing at least two significant helper functions from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`). Ensure your tests cover successful operations and potential error scenarios if easily mockable.
4.  **Run tests**: Execute `npm run test` and ensure all tests pass.
5.  **Lint and Build**: Run `npm run build && npm run lint` to confirm no new errors are introduced.

Remember to keep the diff size small (≤ 150 lines). If necessary, create a separate task for testing additional functions.

```
```
