# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area for improvement is adding unit test coverage to core helper functions. This task specifically targets the Firestore helper functions.

## Objective

Implement Vitest unit tests for the functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup is not yet complete for lib tests)
- `package.json` (only for adding `test` script if not present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Focus on testing the logic and arguments passed to Firebase SDK methods, not the actual Firebase service calls.
- Ensure the tests can run without an active Firebase project connection.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
