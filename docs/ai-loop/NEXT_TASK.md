# Worker Prompt Template

## Context

Phase 2.1 of the roadmap focuses on improving test coverage. The application uses Firebase Firestore for data persistence, and the helper functions in `src/lib/firestore.ts` are critical. Adding unit tests for these helpers will improve stability and maintainability. Vitest is already configured as the test runner.

## Objective

Add unit tests for at least two core helper functions within `src/lib/firestore.ts`, focusing on mocking the Firebase Firestore SDK to ensure isolated testing.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection, no modifications if possible)
- `src/__tests__/firestore.test.ts` (or a new, similar test file)
- `src/__mocks__/firebase/firestore.ts` (if needed for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Write unit tests using Vitest.
- Mock Firebase Firestore SDK calls (e.g., `getDoc`, `setDoc`, `addDoc`, `deleteDoc`, `query`, `getDocs`) using `vi.mock`.
- Ensure tests cover both successful execution and potential error paths for the selected functions.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**

- A new test file `src/__tests__/firestore.test.ts` (or similar) is created.
- It contains unit tests for at least two functions from `src/lib/firestore.ts`.
- Firebase Firestore SDK methods are effectively mocked.
- Tests pass when `npm run test` is executed.
- Code style adheres to `npm run lint`.
