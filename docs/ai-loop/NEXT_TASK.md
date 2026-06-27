```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will kickstart the "2.1 Test coverage" goal by adding unit tests for a critical helper library.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer testing existing APIs)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only to add `vitest` scripts if not already present, but `vitest` should be configured)
- `vite.config.ts` (only to ensure `vitest` setup if not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, `vitest` is already assumed to be present)
- Firebase deploy commands
- Secrets and credentials
- Any files outside of `src/` except for `package.json` and `vite.config.ts` for Vitest configuration.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Focus on adding tests for one or two key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Prioritize functions that interact directly with Firestore.
- Use Vitest and mock the Firebase SDK (e.g., Firestore instance, collection/document references) using `vi.mock` to ensure tests are isolated and fast.
- Do not make extensive changes to the `src/lib/firestore.ts` implementation; the goal is to *test* it.
- Ensure tests cover basic success cases and potential error scenarios (e.g., Firestore operation failure).
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
