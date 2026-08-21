# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no substantive coding tasks have been completed by the AI Loop yet for Phase 2. This task aims to kickstart the test coverage efforts by adding unit tests for a core utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses specifically on testing the interactions with Firestore (e.g., adding, getting, updating, deleting nail items) to ensure their correctness and stability.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments needed for testability, if any)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (if minor setup is required to run tests, though Vitest should be configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` logic.
- Cover common CRUD operations (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`) with unit tests.
- Run `npm run build && npm run lint` before finishing.
- Ensure all tests pass with `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
