```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. This task focuses on adding unit tests for Firestore-related utilities.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary, e.g., exporting unexported functions, but keep changes minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (any other new test helper files if absolutely necessary for mocking)
- `vite.config.ts` (only for Vitest configuration, if minor adjustments are needed for mocks, but `package.json` dependencies are forbidden)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Focus on mocking Firebase SDK functions (e.g., `collection`, `doc`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not require a live Firebase connection.
- Prioritize testing the primary CRUD operations and any data transformation logic within `src/lib/firestore.ts`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement unit tests for the `src/lib/firestore.ts` helper functions.

1.  Create a new test file at `src/__tests__/firestore.test.ts`.
2.  Import and test the functions exported from `src/lib/firestore.ts`.
3.  Use Vitest for writing tests. Assume Vitest is already configured and can be run via `npm run test`.
4.  Mock Firebase Firestore SDK dependencies to ensure tests are isolated. For example, mock functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc` from `firebase/firestore`. The goal is to test the logic within your `firestore.ts` helpers, not the Firebase SDK itself.
5.  Ensure tests cover successful operations and, where applicable, basic error handling paths within the helper functions.
6.  Keep an eye on the 150-line diff limit. If `firestore.ts` is extensive, focus on the most critical functions (e.g., those related to `nailItems` CRUD).

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists and contains unit tests for `src/lib/firestore.ts`.
- The tests mock Firebase Firestore SDK correctly.
- The tests pass when running `npm run test`.
- The code passes `npm run build` and `npm run lint`.

**Required Test Commands:**
```bash
npm run test
npm run build
npm run lint
```

```
```
