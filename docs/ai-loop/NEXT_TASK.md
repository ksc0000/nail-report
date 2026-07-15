```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, which aims to increase test coverage, starting with core utility functions.

## Objective

Add Vitest and write comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts`. This involves setting up Vitest, mocking Firebase SDK dependencies, and creating test cases for each function to ensure their correctness and robustness.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest, if necessary)
- `package.json` (to add `vitest` script, if necessary, but *not* new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as part of Vitest setup.
- Focus on testing the functions within `src/lib/firestore.ts`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
