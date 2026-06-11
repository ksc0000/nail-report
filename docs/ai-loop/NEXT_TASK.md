```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

The current phase is 2.0, focusing on stability, test coverage, and UX. This task addresses Phase 2.1 (Test coverage).

## Objective

Add unit tests for helper functions in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase Firestore interactions to test the helper logic in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring if necessary to enable testing, e.g., exporting unexported functions, but prioritize minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files if logically separate, but keep it simple)

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
- Add unit tests for at least one core Firestore helper function (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`).
- Mock the Firebase Firestore SDK using `vi.mock` to simulate successful data operations.
- Ensure tests run correctly and pass.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
