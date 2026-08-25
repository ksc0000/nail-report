# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. No substantive feature work from the roadmap has been completed yet. The first task will address test coverage by adding unit tests for existing helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if absolutely necessary for basic setup, but avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other styling files

## Requirements

- Add unit tests for the functions that interact with Firestore in `src/lib/firestore.ts`.
- Ensure tests use Vitest and mock Firebase SDK dependencies as needed.
- Strive for good test coverage for the targeted functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new test file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains unit tests for core functions in `src/lib/firestore.ts` (e.g., functions for adding, updating, fetching, or deleting nail items).
- Firebase SDK calls are appropriately mocked to ensure tests run in isolation without requiring actual Firebase access.
- `npm test` runs successfully with the new tests.

**Required Test Commands:**
```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm test
```
