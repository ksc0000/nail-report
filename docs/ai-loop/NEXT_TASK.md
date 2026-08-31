# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for core application logic, specifically targeting Firebase-related helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on covering the main CRUD (Create, Read, Update, Delete) operations related to `nailItems` and `publicShares` handled by these functions, mocking Firebase Firestore SDK methods as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are allowed if absolutely necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a Vitest script or similar minor configuration *without* adding new npm dependencies)
- `vite.config.ts` (if Vitest configuration needs minor adjustments to recognize test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests covering at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `createPublicShare`, `getPublicShare`).
- Use Vitest and mock Firestore SDK functions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) to isolate the logic being tested.
- Ensure tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
