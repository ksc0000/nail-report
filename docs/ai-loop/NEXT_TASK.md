# Worker Prompt Template

## Context

The current phase of the roadmap is `2.0`, focusing on improving stability, test coverage, and UX. The immediate goal is to enhance test coverage. This task focuses on adding unit tests for existing helper functions within the `src/lib/firestore.ts` file, a key component for data management.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`. These tests should cover the core logic of the Firestore interaction functions, ensuring their stability and correctness. Focus on mocking Firebase SDK dependencies as needed to create isolated unit tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications only, if strictly necessary for testability, e.g., exporting unexported helpers)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils.ts` (optional: for common test mocks/helpers if deemed necessary and small)
- `vite.config.ts` (if minor Vitest configuration adjustments are needed, but prioritize existing setup)
- `package.json` (only for ensuring a `test` script is present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vitest.mock` to ensure tests are isolated and don't interact with actual Firebase services.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`.
- Ensure tests cover success cases and common error scenarios.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

**Worker Prompt:** Implement unit tests for `src/lib/firestore.ts` helpers.

**Example functions to test (prioritize based on complexity/importance):**
- Functions related to creating, reading, updating, or deleting nail items.
- Functions interacting with `publicShares` if they exist in `firestore.ts`.

Ensure tests use appropriate mocking for Firebase functions (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least two `describe` blocks, each covering a distinct helper function from `src/lib/firestore.ts`.
- Each `describe` block contains multiple `it` blocks for different test cases (e.g., success, error, edge cases).
- Firebase SDK functions are mocked using `vitest.mock` to prevent actual network calls.

**Required Test Commands:**
```bash
npm test # Or 'npm run test' depending on package.json script
npm run build
npm run lint
```
