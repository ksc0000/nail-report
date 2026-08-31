# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions for Vitest configuration if necessary, e.g., test environment)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files
- Any UI components or pages
- `src/lib/storage.ts`, `src/lib/auth.ts`, `src/lib/publicShares.ts` (do not modify in this task)

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vi.mock` to mock Firebase SDK dependencies (Firestore and Auth) to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover both successful execution and potential error scenarios for the chosen functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
