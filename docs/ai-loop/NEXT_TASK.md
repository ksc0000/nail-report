```markdown
# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. The current task is to enhance test coverage for core utility functions.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export for testing if necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)

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

## Worker Prompt

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Set up Vitest to mock Firebase SDK dependencies (e.g., `firebase/firestore`) as needed, to ensure tests are isolated and do not interact with actual Firebase services.
3.  Write unit tests for all exported helper functions in `src/lib/firestore.ts`. Focus on testing their core logic, input validation, and expected outputs under various conditions.
4.  Ensure test coverage for edge cases relevant to Firestore operations (e.g., empty inputs, specific data structures).
5.  Verify that `npm test` runs successfully and all new tests pass.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists and contains unit tests.
- All exported functions in `src/lib/firestore.ts` have at least one corresponding unit test.
- Firebase SDK calls are appropriately mocked to prevent network requests and ensure tests are fast and deterministic.
- Running `npm test` executes the new tests successfully.

## Required test commands

```bash
npm test
npm run build
npm run lint
```

## Known issues or limitations

- None anticipated with this task.

## Suggested next task

Add `aria-label` to all icon-only buttons to improve accessibility.
```
