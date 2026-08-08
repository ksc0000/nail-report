```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically targets the `firestore.ts` helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils.ts` (if common testing utilities are needed, unlikely for this task)

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
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Focus on testing key helper functions within `src/lib/firestore.ts` (e.g., functions for adding, getting, updating, deleting nail items or tags).
- Mock Firebase SDK dependencies as needed using `vi.mock` from Vitest.
- Ensure tests are independent and cover basic functionality.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
