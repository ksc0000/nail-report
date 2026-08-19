# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state shows that core AI Loop setup tasks are complete, and the first substantive task is pending. The goal is to incrementally improve the application following the defined phases.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing the primary CRUD operations (create, read, update, delete) for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to production code)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if a `test` script needs to be added or modified for Vitest, but Vitest is already adopted so this should be minimal or unnecessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages; Vitest is already established)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems` or `updateNailItem`).
- Use Vitest for testing and `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`).
- Ensure tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
