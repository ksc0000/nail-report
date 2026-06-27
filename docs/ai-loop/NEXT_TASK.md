```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. No substantive product tasks have been completed by the AI Loop yet, making this a foundational step for Phase 2. This task specifically targets adding unit test coverage for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments if necessary for testability, but focus is on creating tests)
- `src/__tests__/` (create new test file(s) for `firestore.ts`)
- `vitest.config.ts` (if minor adjustments are needed for test setup, but `vi.mock` should be used for Firebase SDK mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any files outside `src/lib/firestore.ts`, `src/__tests__/`, `vitest.config.ts`

## Requirements

- Add unit tests for `src/lib/firestore.ts` functions (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.).
- Mock Firebase SDK dependencies using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure good test coverage for the functions, covering happy paths and basic error handling where appropriate for the helpers.
- Keep diff ≤ 150 lines. Focus on creating the test file(s).
- Run `npm run build && npm run lint && npm run test` before finishing and report results.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
