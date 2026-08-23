```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. This task focuses on `src/lib/firestore.ts`.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically targeting the CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to improve testability, if strictly necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)
- Any files outside `src/lib/firestore.ts` and `src/__tests__/lib/firestore.test.ts`

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Mock the Firebase SDK (`firebase/firestore`) using `vi.mock` to isolate the logic being tested.
- Ensure tests cover basic success cases and error handling where applicable.
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
