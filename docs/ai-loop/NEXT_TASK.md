# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task will contribute to test coverage by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if necessary for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup for mocks is needed)
- `package.json` (only if adding `vitest` or `jsdom` for `test` script)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except if vitest config requires it for a test environment like `jsdom`)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except `vite.config.ts`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Focus on testing the helper functions that interact with Firestore directly (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.).
- Ensure `npm run build && npm run lint` passes after changes.
- Ensure `npm run test` passes after changes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/__tests__/lib/firestore.test.ts` is created.
- This file contains unit tests for at least two key functions in `src/lib/firestore.ts`.
- Firebase SDK calls are appropriately mocked.
- `npm run test` passes without errors.

**Required Test Commands:**
```bash
npm install # if new test deps like jsdom are needed for the test environment
npm run test
npm run build
npm run lint
```
