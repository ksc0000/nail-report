# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker prompt

## Objective

Add comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Details

Focus on testing the core CRUD operations for `nailItems` within `src/lib/firestore.ts`. This includes functions such as `addNailItem`, `getNailItems`, `getNailItem`, `updateNailItem`, and `deleteNailItem`, and any other significant helper functions in that file.

You will need to:
1. Create a new test file, likely `src/__tests__/lib/firestore.test.ts`.
2. Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure tests are isolated unit tests and do not hit actual Firebase services.
3. Write test cases that cover successful operations and potential error scenarios (e.g., item not found, permission denied if applicable via mocks).
4. Ensure the tests are clear, readable, and follow best practices for unit testing.
5. Minor adjustments to `src/lib/firestore.ts` might be acceptable if they significantly improve testability without altering functionality (e.g., exporting unexported helper functions).

## Acceptance Criteria

- A new test file `src/__tests__/lib/firestore.test.ts` is created.
- Key functions within `src/lib/firestore.ts` have unit test coverage.
- Tests mock Firebase SDK dependencies and run without network calls.
- `npm test` runs successfully, and all new tests pass.
- The change adheres to the specified line diff limit.

## Required test commands

```bash
npm run build
npm run lint
npm test
```
