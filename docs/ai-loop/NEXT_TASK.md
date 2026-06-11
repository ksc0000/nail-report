```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on ensuring the basic CRUD operations (add, get, update, delete) for nail items and public shares, or any other stateless helper functions, are covered.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but prefer not to modify existing logic)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` for the new tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vitest`'s mocking capabilities.
- Focus on testing the functions' logic in isolation, assuming Firebase SDK calls work as expected after mocking.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- At least two helper functions from `src/lib/firestore.ts` have basic unit tests covering their intended functionality.
- Tests use Vitest and correctly mock Firebase SDK dependencies.
- All tests pass when running `npm test`.

## Required Test Commands

```bash
npm test
npm run build
npm run lint
```
```
