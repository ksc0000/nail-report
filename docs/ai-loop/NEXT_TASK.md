```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. The first step in this phase is to establish unit test coverage for core utility functions. This task focuses on the Firestore helper functions. Vitest has been selected as the test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`, using Vitest and mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes might be needed for testability, e.g., exporting non-exported functions if necessary, but keep these minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minimal configuration is needed for mocks, e.g., `globals: true` or `setupFiles`)

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

Your task is to add unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock Firebase Firestore SDK functions (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `collection`, `doc`, `query`, `where`, `orderBy`, etc.) to isolate the logic in `src/lib/firestore.ts` from actual Firebase calls.
3.  **Write Unit Tests**: Focus on testing the core CRUD and public share related functions in `src/lib/firestore.ts`.
    *   `createNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `createPublicShare`
    *   `deletePublicShare`
    *   `getPublicShareByNailItemId`
4.  **Test Scenarios**: For each function, write tests that cover:
    *   Successful execution with expected return values or side effects.
    *   Basic error handling (e.g., if a mocked Firebase call throws an error, ensure the `firestore.ts` function handles it gracefully if designed to do so).
5.  **No new npm dependencies**: Do not add any new packages to `package.json`. Assume Vitest is already installed and configured. If `vitest.config.ts` needs minimal additions for mocking setup (e.g., `setupFiles` or `globals: true`), include them within the line limit. If Vitest is not runnable, report this as a blocking issue.
6.  **Maintainability**: Ensure test code is clean, readable, and well-structured.

**Acceptance Criteria:**

- A new test file `src/__tests__/firestore.test.ts` exists.
- Key functions from `src/lib/firestore.ts` (`createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `createPublicShare`, `deletePublicShare`, `getPublicShareByNailItemId`) have unit test coverage.
- Firebase SDK calls are appropriately mocked using `vi.mock`.
- All tests pass.
- No new npm dependencies are introduced.

**Required test commands:**

```bash
npm test # To run the new unit tests
npm run build
npm run lint
```
```
