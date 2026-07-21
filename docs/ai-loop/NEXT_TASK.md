# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state shows that initial AI Loop setup tasks are complete, and the first substantive task is pending. The next step is to begin implementing test coverage, specifically for core utility functions.

## Objective

Add Vitest and write unit tests for the helper functions in `src/lib/firestore.ts`. This involves setting up Vitest if not already configured for `src/lib/` files and then writing tests that mock Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, or minor refactors)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest if needed)
- `package.json` (to add Vitest script if not already present, but **no new npm dependencies**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, only add `test` script if not present)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the specified `Allowed Scope`.

## Requirements

- Keep diff ≤ 150 lines.
- Add Vitest to the project's test setup, if it's not already configured for `src/lib` files.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`. Focus on functions that interact with Firestore.
- Mock Firebase SDK dependencies using `vi.mock` as needed to isolate the functions under test.
- Ensure tests cover basic success cases and error handling where applicable.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
