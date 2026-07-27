```markdown
# Worker Prompt Template

## Context

The current focus is on improving stability, test coverage, and UX in Phase 2. The immediate goal is to begin adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing basic CRUD operations or data conversion functions if applicable.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer to test existing exports)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for Firebase mocking setup, if absolutely necessary, but prioritize existing setup)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or folders outside of `src/` except `vitest.config.ts` if strictly needed for Firebase mocking setup.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Write at least 2-3 basic unit tests for functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
