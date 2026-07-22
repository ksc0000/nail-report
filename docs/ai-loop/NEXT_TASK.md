# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for a core Firebase helper module.

## Objective

Implement unit tests for the functions defined in `src/lib/firestore.ts`. This involves mocking the Firebase SDK to ensure tests are isolated and run efficiently.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minimal additions for `vi.mock` if strictly necessary and within 150 lines)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do NOT add new npm packages; assume Vitest is already configured as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Use `vitest` for the test runner and `vi.mock` for mocking Firebase SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`).
- Cover all exportable helper functions in `src/lib/firestore.ts` with unit tests.
- Ensure tests use realistic mock data that reflects the `nailItems` and `publicShares` collections.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules,

Your task is to add comprehensive unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore SDK functions (`getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `getDocs`, etc.) to isolate tests from actual Firebase interactions.
3.  **Implement Tests:** Write unit tests for all exportable functions in `src/lib/firestore.ts`. Focus on testing inputs, outputs, error conditions, and interactions with the mocked Firebase SDK.
    *   Ensure coverage for creating, reading, updating, and deleting `nailItems` and `publicShares`.
    *   Include tests for any data transformation logic between Firestore documents and application models.
4.  **Use Realistic Mock Data:** Create mock data that mimics the structure and content of your `nailItems` and `publicShares` collections, including timestamps, IDs, tags, image URLs, etc.
5.  **Adhere to Constraints:** Remember the diff limit (≤ 150 lines) and the restriction against adding new npm dependencies. Assume Vitest is already installed and configured.
6.  **Verify:** Run `npm test`, `npm run build`, and `npm run lint` to ensure all tests pass, the project builds successfully, and there are no linting errors.

If Vitest is not configured and this prevents you from adding tests without adding new dependencies to `package.json`, please report this as a known issue rather than proceeding with dependency changes.
