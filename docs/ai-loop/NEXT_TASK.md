# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The current state indicates that no substantive task has been completed yet, making a core test coverage task a logical next step.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts` to improve test coverage for the application's data layer.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if adding a test script, but Vitest should already be configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, preferably `src/__tests__/firestore.test.ts`.
- Focus on writing unit tests for core CRUD operations in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
- Use Vitest and mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to isolate the logic being tested. Refer to existing test setups for mocking patterns if available.
- Ensure tests cover successful operations and basic error handling scenarios if applicable within the helper functions.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
