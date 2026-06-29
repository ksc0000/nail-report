```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. The roadmap explicitly calls for unit tests for Firestore helper functions. This task will initiate test coverage for the core data access layer.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`, focusing on mocking the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications only, if needed to improve testability)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (only if absolutely necessary for mocking setup, but prefer existing configuration)

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

Implement unit tests for `src/lib/firestore.ts` by performing the following steps:

1.  **Create a new test file:** Add a new file at `src/lib/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Use `vi.mock` to mock the necessary functions from `firebase/firestore` (e.g., `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`, `query`, `where`) to simulate their behavior without making actual calls to Firebase.
3.  **Write unit tests:** Implement unit tests for at least the primary CRUD (Create, Read, Update, Delete) helper functions found in `src/lib/firestore.ts` related to `nailItems` and `publicShares`. Focus on testing the logic within these functions, assuming the Firebase SDK methods behave as mocked.
4.  **Ensure test isolation:** Each test should be independent and clean up any mocks or test data if necessary.

### Acceptance Criteria

-   A new file `src/lib/__tests__/firestore.test.ts` is created.
-   The new file contains unit tests for at least `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (or similar core CRUD functions from `src/lib/firestore.ts` if names differ).
-   Firebase Firestore SDK functions are effectively mocked using `vi.mock`.
-   All new tests pass successfully.

### Required test commands

```bash
npm run test
npm run build && npm run lint
```

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
