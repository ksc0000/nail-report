```markdown
# Worker Prompt Template

## Context

The current phase of development focuses on improving stability, test coverage, and UX. This task specifically addresses the first point in Phase 2.1: Test coverage. The goal is to begin adding unit tests for the core utility functions.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. The tests should cover the main Firestore interaction functions for managing `nailItems` and `publicShares`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/setup.ts` or similar for Vitest setup if required for mocking Firebase (if not already present).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to perform isolated unit tests. Assume Vitest is already configured.
- Focus on testing the public helper functions exposed by `src/lib/firestore.ts`.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
