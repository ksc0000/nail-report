# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin addressing test coverage by adding unit tests for key utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor refactors to improve testability, if necessary)
- `src/__tests__/` (specifically `src/__tests__/lib/firestore.test.ts` for new test files)
- `vite.config.ts` (for minor adjustments to Vitest configuration if strictly necessary for mocking Firebase, but prefer existing setup)

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
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two core functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Ensure tests cover successful operations and potential error scenarios where applicable.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
