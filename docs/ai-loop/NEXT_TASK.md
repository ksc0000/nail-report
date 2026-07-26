```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current focus is on test coverage, with Vitest as the chosen test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add testable exports if necessary, but prefer testing existing exports)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `package.json` (only to confirm `vitest` is a dev dependency, no new dependencies to be added)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do not add new npm packages, assume `vitest` is already a dev dependency)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` logic.
- Cover common functions such as `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem` (or similar CRUD operations if names differ).
- Ensure tests pass locally.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/lib/firestore.test.ts`.
2.  **Import Vitest**: Use `import { describe, it, expect, vi, beforeEach } from 'vitest';`.
3.  **Mock Firebase SDK**: Since `src/lib/firestore.ts` interacts with the Firebase SDK (Firestore specifically), you will need to mock these interactions using `vi.mock('firebase/firestore', ...)` or by mocking the `getFirestore` function and its return values. Focus on mocking at the Firestore SDK level rather than the Firebase App initialization.
4.  **Test helper functions**: Write tests for the core CRUD operations related to nail items (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar functions that interact with the `nailItems` collection).
    *   Focus on asserting that the correct Firestore methods are called with the expected arguments (e.g., `collection`, `addDoc`, `doc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, `orderBy`).
    *   Test both successful execution paths and error handling paths (e.g., if a Firestore operation fails).
5.  **Run tests**: Execute `npm test` or `vitest` to confirm your tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes linting checks with `npm run build && npm run lint`.
```
