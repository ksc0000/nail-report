# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The application currently lacks unit tests for its core utility functions.

## Objective

Implement unit tests for helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications only, if necessary for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if absolutely necessary for test setup, otherwise avoid)

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

## Worker prompt

Your task is to add unit tests for helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` from Vitest to mock Firebase Firestore SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the external dependencies so that your tests verify the logic within `firestore.ts` itself, not the Firebase SDK.
3.  **Implement Unit Tests**:
    *   Start by writing tests for a few key functions within `src/lib/firestore.ts`. Prioritize functions that perform CRUD operations or data transformations.
    *   Ensure each test focuses on a single aspect of the function's behavior.
    *   Use `expect` assertions to verify the outcomes, including successful data retrieval, correct data updates, error handling, etc.
4.  **Verification**:
    *   Run `npm test` to ensure all new tests pass.
    *   Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

Focus on adding a solid foundation of tests for a subset of functions, staying within the line limit. It is not required to achieve 100% coverage of `firestore.ts` in this single PR.

**Acceptance Criteria**:
- New file `src/__tests__/lib/firestore.test.ts` exists.
- At least two functions from `src/lib/firestore.ts` have corresponding unit tests.
- Firebase SDK dependencies are mocked correctly within the tests.
- All new tests pass when `npm test` is run.
- The PR diff is ≤ 150 lines.

**Required Test Commands**:
```bash
npm test
npm run build
npm run lint
```
