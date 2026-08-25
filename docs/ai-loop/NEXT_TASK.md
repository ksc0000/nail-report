# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using the project's existing Vitest setup.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/*.test.ts` (other new test files, if functionally separate concerns emerge from `firestore.ts`)
- `vite.config.ts` (minimal configuration updates related to Vitest if absolutely necessary and without adding new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any UI components or pages outside of `src/lib/firestore.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK interactions where appropriate to ensure true unit tests.
- Cover at least two distinct helper functions in `src/lib/firestore.ts` with tests.
- Ensure tests run successfully using `npm test` or `vitest`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Please add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Identify key helper functions** in `src/lib/firestore.ts` that interact with Firebase Firestore (e.g., functions for adding, fetching, updating, or deleting nail items).
2.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
3.  **Implement unit tests** for at least two of these identified functions.
    *   Use Vitest for testing. Assume Vitest is already installed and configured in the project. If `npm test` or `vitest` commands don't work, report this as a blocker.
    *   Mock Firebase Firestore SDK methods (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) to isolate the logic within `src/lib/firestore.ts` for testing.
    *   Ensure tests cover typical success cases and relevant error scenarios (e.g., network errors, permissions issues if applicable to the helper function's error handling).
4.  **Ensure tests pass** locally.
5.  **Do not add new npm packages** to `package.json`. If Vitest setup is truly missing, report this as a blocker.
6.  **Maintain a small diff** (≤150 lines).
