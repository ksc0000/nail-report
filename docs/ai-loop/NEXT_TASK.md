# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses specifically on adding tests for existing functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting non-exported functions if strictly necessary, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (if minor configuration tweaks are required for the new test file to run, but avoid major refactors)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (specifically, adding new npm dependencies is forbidden without human approval. Assume Vitest is already configured as a dev dependency.)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for the primary helper functions in `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getItems`, `getPublicShareLink`).
- Mock Firebase SDK dependencies (Firestore, Auth) as needed to isolate the logic of the `firestore.ts` functions for unit testing.
- Tests should cover typical success cases and basic error handling where applicable to the function's direct logic.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
