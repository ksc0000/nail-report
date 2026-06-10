# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability, test coverage, and UX in Phase 2. This task focuses on **2.1 Test coverage** by adding unit tests for core Firebase helper functions. This is the first substantive task from the "Jules-ready Tasks" list, laying the groundwork for better code reliability.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This includes mocking Firebase SDK dependencies as needed.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (add test configuration if not already present)
- `package.json` (add Vitest scripts if not already present, but **no new npm dependencies**)

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
- Write unit tests for at least two significant helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK calls are properly mocked using `vitest` and `vi.mock` to allow for isolated unit testing without actual Firebase calls.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` (or equivalent Vitest command) to ensure tests pass.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
