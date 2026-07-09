# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin addressing test coverage by adding unit tests for core helper functions.

## Objective

Implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/setup.ts` (if required for global test setup, minimal changes)
- Existing test utility files in `src/__tests__/` (e.g., mock firebase setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`).
- Ensure Firebase SDK calls are mocked using `vi.mock` as appropriate for unit testing.
- The tests should cover successful operations and basic error handling for the tested functions.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains unit tests for at least two functions from `src/lib/firestore.ts`.
- Firebase SDK dependencies are properly mocked.
- `npm test` runs successfully with the new tests passing.
- The PR diff is within the 150-line limit.

**Required test commands:**
```bash
npm install # Ensure all dependencies are in place
npm run build
npm run lint
npm test
```
