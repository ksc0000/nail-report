```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The first substantive task is to enhance test coverage for core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary to make functions testable, e.g., exporting non-exported helpers)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `package.json` (only to add a `test` script if not already present, or modify an existing one to include vitest; *no new dependencies*)
- `vite.config.ts` (if Vitest configuration is needed and not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages *without human approval*; Vitest is assumed to be ready for use, if `vitest` itself needs to be added as a *new* dependency, please report it as a blocker/limitation)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., functions related to `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for the test runner.
- Mock Firebase SDK dependencies as needed to ensure tests are truly unit tests and do not hit actual Firebase services.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
