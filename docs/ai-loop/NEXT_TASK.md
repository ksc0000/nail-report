# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to address "2.1 Test coverage" by adding unit tests for core helper functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to configure Vitest if needed)

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

## Worker Prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest**: Ensure Vitest is correctly configured to run tests (if `vite.config.ts` needs adjustment for `test.environment`, `test.globals`, or `test.setupFiles`, make those changes).
3.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` depends on (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`, `where`). Focus on mocking the *behavior* of these functions as needed for the tests, rather than the entire SDK.
4.  **Write unit tests**:
    *   Focus on testing at least two key functions from `src/lib/firestore.ts`. Good candidates include:
        *   `createNailItem`
        *   `getNailItems` (or a related function that fetches a list)
        *   `updateNailItem`
        *   `deleteNailItem`
        *   `getPublicShare`
        *   `createPublicShare`
    *   Ensure tests cover successful execution and basic error cases (e.g., a function throwing an error due to a mocked Firestore failure).
    *   Verify that the functions correctly interact with the mocked Firestore (e.g., calling `setDoc` with the correct data, `getDocs` returning expected data).
5.  **Run tests**: Execute `npm test` or `vitest` to ensure all new tests pass.

**Acceptance Criteria**:
- A new file `src/__tests__/firestore.test.ts` exists.
- At least two functions from `src/lib/firestore.ts` are covered by unit tests.
- The tests correctly mock Firebase Firestore dependencies.
- All new tests pass when running `npm test`.

**Required Test Commands**:
```bash
npm install # if any vitest config changes require
npm test
npm run build
npm run lint
```
