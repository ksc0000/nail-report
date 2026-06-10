# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability is acceptable if necessary, but avoid significant functional changes)
- `src/lib/__tests__/firestore.test.ts` (create this new test file)
- `src/App.css` (only for minor, unrelated style fixes if absolutely needed for build, not the primary focus)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/lib/__tests__/firestore.test.ts`.
- Write unit tests using Vitest (assume Vitest is already configured).
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as needed to isolate `firestore.ts` logic.
- Focus on testing the public helper functions exported from `src/lib/firestore.ts` (e.g., functions for CRUD operations on `nailItems` or `publicShares`).
- Ensure tests cover both successful execution paths and error handling where applicable.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- All tests must pass (`npm run test`).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/lib/__tests__/firestore.test.ts` exists.
- The new test file contains unit tests for key helper functions in `src/lib/firestore.ts`.
- Firebase SDK dependencies are appropriately mocked.
- All tests pass when running `npm run test`.
- The code passes linting (`npm run lint`) and builds successfully (`npm run build`).

**Required Test Commands:**
```bash
npm run test
npm run build
npm run lint
```

**Suggested next task:** Add loading skeleton to nail item list (`src/App.tsx`)
