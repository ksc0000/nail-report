```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in this phase is adding unit tests for core utility functions. This task specifically targets the Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring robust test coverage for interactions with the Firestore SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Prompt

## Context

The product roadmap prioritizes adding unit test coverage for core utility functions as part of Phase 2.1. This task focuses on `src/lib/firestore.ts`.

## Objective

Create a new test file `src/__tests__/lib/firestore.test.ts` and add unit tests for the functions exported from `src/lib/firestore.ts`.

## Details

1.  **Create Test File**: Create a new file `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK methods that `src/lib/firestore.ts` interacts with. This will allow tests to run without actually connecting to Firebase. Focus on mocking methods like `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `addDoc`, `collection`, `query`, etc., as needed by the functions under test.
3.  **Test Helper Functions**: Implement unit tests for the helper functions in `src/lib/firestore.ts`. Examples might include functions related to `nailItems` CRUD operations (e.g., `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`) or `publicShares` if they exist in that file.
4.  **Assertion**: Use Vitest's assertion library to verify that the functions correctly call the mocked Firebase methods with the expected arguments and return the expected values.
5.  **Scope**: Only add tests for `src/lib/firestore.ts`. Do not modify other `src/lib` files unless absolutely necessary to make `firestore.ts` testable (e.g., exporting a previously unexported helper). Any such modification must be minimal.

## Acceptance Criteria

-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   The new test file includes `vi.mock` calls to correctly mock the Firebase Firestore SDK.
-   At least two helper functions from `src/lib/firestore.ts` have corresponding unit tests that assert their behavior and interactions with the mocked Firestore SDK.
-   All new tests pass.

## Required test commands

```bash
npm test
npm run build
npm run lint
```
```
