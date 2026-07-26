```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product roadmap indicates that Phase 2 is active, with a focus on improving stability, test coverage, and UX. This task addresses the "Test coverage" aspect (2.1).

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, e.g., exporting unexported functions if appropriate for testing, but prefer to test existing exports).
- `src/__tests__/firestore.test.ts` (new file for tests).
- `src/__tests__/utils.ts` (or similar, if common mocking utilities are needed, but keep it minimal).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing the exported helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, etc.).
- Mock Firebase SDK functions using `vi.mock` as necessary to isolate the `firestore.ts` logic.
- Ensure tests cover basic success cases and error handling for relevant functions.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
