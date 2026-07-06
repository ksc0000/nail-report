```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. The current task is to improve test coverage, specifically for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This includes setting up mocks for Firebase SDK dependencies where necessary.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add testable exports if needed, but primarily test *against* it)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (No changes expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is already available as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, preferably `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions exported from `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as needed to isolate the logic being tested.
- Ensure tests cover typical success cases and basic error handling scenarios for the Firestore operations.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
