# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state shows that initial AI Loop setup is complete, and a first substantive task is pending.

## Objective

Implement Vitest unit tests for the `getNailItems` and `addNailItem` functions in `src/lib/firestore.ts`, utilizing mocking for Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add testing hooks if necessary, though unlikely for these specific functions)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest setup for mocking needs minor adjustment, but ideally already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css` (not relevant to this task)

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for `getNailItems` and `addNailItem` functions from `src/lib/firestore.ts`.
- Mock Firebase SDK functions (e.g., `getDocs`, `addDoc`, `collection`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover successful operations and basic error handling scenarios for the mocked calls.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
