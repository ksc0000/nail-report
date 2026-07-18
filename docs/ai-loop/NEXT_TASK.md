# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for select helper functions within `src/lib/firestore.ts` using Vitest, specifically targeting functions related to basic nail item CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments might be needed for testability, but focus on adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer not to touch if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two functions from `src/lib/firestore.ts` that handle interaction with the `nailItems` collection (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Utilize `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to isolate the logic in `firestore.ts` from actual Firebase calls.
- Ensure the tests assert the correct interaction with the mocked Firebase SDK functions (e.g., that specific functions were called with expected arguments).
- Keep the overall diff for this PR strictly ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
