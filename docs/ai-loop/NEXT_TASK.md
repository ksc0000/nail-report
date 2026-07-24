# Worker Prompt Template

## Context

The current phase of the `nail-report` application development focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort as outlined in Phase 2.1 of the roadmap.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (if minimal configuration is needed for Firebase mocking, though Vitest should be pre-configured)

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

## Worker Prompt

Your task is to add comprehensive unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** In `src/__tests__/lib/`, create a new file named `firestore.test.ts`.
2.  **Identify helper functions:** Focus on testing the core CRUD operations for `nailItems` and `publicShares` (e.g., `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
3.  **Write unit tests:**
    *   For each helper function, write tests that cover:
        *   Successful execution with valid input.
        *   Error handling (e.g., Firebase errors, invalid IDs).
        *   Edge cases relevant to the function's logic.
    *   Utilize Vitest for the test runner.
    *   **Crucially, mock Firebase SDK interactions** using `vi.mock` to isolate the `firestore.ts` logic from actual Firebase calls. This includes `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, etc. The goal is to test *your* code, not Firebase itself.
4.  **Ensure testability:** If any minor refactoring in `src/lib/firestore.ts` is required to make functions more testable (e.g., exporting previously un-exported functions or making dependencies injectable), you may perform it, ensuring the change is minimal and within the line limit.
5.  **Run tests:** Execute `npm test` and ensure all new tests pass.

**Acceptance Criteria:**

*   A new file `src/__tests__/lib/firestore.test.ts` exists.
*   The new test file contains unit tests for multiple helper functions in `src/lib/firestore.ts`.
*   Firebase SDK functions are appropriately mocked using `vi.mock`.
*   Tests cover successful paths and relevant error scenarios.
*   `npm test` runs successfully, and all new tests pass.

**Required Test Commands:**

```bash
npm install # Only if vitest or related test dependencies need initial setup, but should largely be pre-configured.
npm run build
npm run lint
npm test
```
