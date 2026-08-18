```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2.1. This task focuses on adding unit tests for core Firebase Firestore helper functions to ensure their reliability and correctness.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on basic CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if *minimal* Vitest configuration is absolutely required and Vitest is already an existing dependency)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest must be pre-installed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

### Task: Add Vitest unit tests for `src/lib/firestore.ts` helper functions

1.  **Verify Vitest Setup**: Ensure Vitest is configured and available in the project. Do *not* add new `npm` dependencies. If `vitest` is not in `package.json`, report this as a blocking issue. Assume it is already available as per roadmap.
2.  **Create Test File**: Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK**:
    *   Use `vi.mock('firebase/firestore')` to mock Firestore-related functions.
    *   Create mock implementations for key Firestore functions that `src/lib/firestore.ts` uses, such as `collection`, `doc`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, and `onSnapshot`.
    *   Focus on mocking the *behavior* relevant to the `firestore.ts` helpers rather than a complete Firebase SDK mock.
4.  **Write Unit Tests**:
    *   Focus on testing the core CRUD helper functions from `src/lib/firestore.ts`. Start with `addNailItem` and `getNailItem` (or `getNailItems`).
    *   Ensure tests cover successful operations and, if possible within the line limit, basic error handling if present in the helpers.
    *   Example functions to test:
        *   `addNailItem`: Verify it calls `addDoc` with correct arguments and returns the expected ID.
        *   `getNailItem`: Verify it calls `getDoc` and transforms the snapshot correctly.
    *   Avoid complex scenarios or edge cases for this initial task to keep the PR small.
5.  **Run Tests**: Ensure the newly added tests pass by running `npm test`.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

This task specifically targets `src/lib/firestore.ts` helpers. Do not write tests for `storage.ts` or `auth.ts` in this task.
```
