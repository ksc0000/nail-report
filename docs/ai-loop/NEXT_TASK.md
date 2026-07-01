# Worker Prompt Template

## Context

The product roadmap outlines a focus on improving stability, test coverage, and UX in Phase 2. The current state indicates that the AI Loop setup is complete and a first substantive task is pending.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This aligns with Phase 2.1 Test coverage.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if necessary to configure Vitest, but prefer to assume it's ready)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions within `src/lib/firestore.ts`. Focus on mocking Firebase SDK interactions to test the logic of the helper functions.
- Aim for good coverage of the `firestore.ts` helper functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the Firestore helper functions.

1.  **Create a test file**: Add a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock Firebase Firestore SDK functions and methods that `src/lib/firestore.ts` interacts with (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`).
3.  **Write unit tests**:
    *   Test functions like `getNailItems`, `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare` (if applicable and exported).
    *   Verify that the functions correctly call the mocked Firebase methods with the expected arguments.
    *   Test successful scenarios and error handling.
4.  **Run tests**: Execute `npm run test` and ensure all new tests pass.
5.  **Lint and build**: Ensure the project still lints and builds successfully (`npm run lint`, `npm run build`).

**Acceptance Criteria:**
-   New file `src/__tests__/firestore.test.ts` exists.
-   Unit tests cover the primary helper functions in `src/lib/firestore.ts`.
-   Firebase Firestore SDK interactions are properly mocked.
-   `npm run test` completes successfully with the new tests passing.
-   `npm run lint` and `npm run build` pass without errors.

**Required test commands:**
```bash
npm run test
npm run lint
npm run build
```
