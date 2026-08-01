```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

The application is in Phase 2, focusing on stability, test coverage, and UX. This task will contribute to improving test coverage for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (add aliases or global mocks if necessary for Firebase SDK mocking)
- `package.json` (only to add `vitest` scripts if not already present, *no new npm dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not hit actual Firebase services.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
```
