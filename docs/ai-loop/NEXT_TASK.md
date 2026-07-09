```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective in Phase 2.1 is to increase test coverage, specifically by adding unit tests for Firebase helper functions using Vitest and mocking the Firebase SDK. This task aims to kickstart this effort by focusing on the `firestore.ts` utility file.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This involves setting up a new test file and mocking the Firebase SDK to ensure tests are isolated and efficient.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to the original file)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/` (other new test utility files, e.g., for common mocks)
- `package.json` (only to confirm or add a `test` script if missing, no new npm dependencies)
- `vite.config.ts` (only for Vitest configuration if necessary, e.g., for test setup files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css` (irrelevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure the Firebase SDK (Firestore specifically) is mocked using `vi.mock` to prevent actual Firebase calls during tests.
- Run `npm run test` (or `vitest`) to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
```
