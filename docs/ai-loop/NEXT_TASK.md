# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for Firestore helper functions in `src/lib/firestore.ts` using Vitest. This addresses Phase 2.1 of the roadmap, focusing on improving test coverage.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/` (new test files)
- `src/App.css` (not directly relevant for this task, but allowed)

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

### Acceptance Criteria

1.  Add unit tests for at least two helper functions within `src/lib/firestore.ts`.
2.  Use Vitest for the tests.
3.  Ensure Firebase SDK interactions within the tested functions are properly mocked.
4.  Place new test files in `src/__tests__/`.
5.  The tests should pass successfully.

### Required Test Commands

```bash
npm run test
npm run build
npm run lint
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
