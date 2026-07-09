# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task targets test coverage for core utility functions. Vitest is already configured and ready for use.

## Objective

Implement unit tests using Vitest for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection; minor changes allowed if necessary for testability, but avoid refactoring core logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files if necessary, but keep it contained to `firestore.test.ts` for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.
- Focus on mocking Firebase SDK calls (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) using `vitest` and `vi.mock`.
- Aim to test at least two key CRUD helper functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) from `src/lib/firestore.ts`.
- The tests should verify correct interaction with the mocked Firebase SDK and expected return values.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
