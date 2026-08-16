```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

### Task: Add unit tests for Firestore helper functions

Implement unit tests for the `getNailItems` and `addNailItem` helper functions located in `src/lib/firestore.ts`.

**Details:**
1.  Create a new test file: `src/__tests__/lib/firestore.test.ts`.
2.  Set up Vitest and mock the Firebase SDK (specifically Firestore-related imports and methods) as needed to isolate the `firestore.ts` functions for testing. Refer to the roadmap's mention of "Mocking Firebase SDK (vitest + vi.mock)".
3.  Write at least two unit tests:
    *   One for `getNailItems` to ensure it correctly fetches data (using mocked Firestore responses).
    *   One for `addNailItem` to ensure it correctly calls Firestore's `addDoc` (using mocked Firestore behavior).
4.  Ensure that the tests do not make actual network calls to Firebase.
5.  Keep the test file concise and focused.

**Acceptance Criteria:**
*   A new file `src/__tests__/lib/firestore.test.ts` exists.
*   The tests mock Firebase Firestore dependencies correctly.
*   `getNailItems` and `addNailItem` are tested for their core functionality.
*   All new tests pass when `npm test` is run.
*   The overall solution respects the diff limit of 150 lines.

**Required Test Commands:**
```bash
npm install # Only if dependencies are needed for running tests, typically not for a new test file.
npm test
npm run build
npm run lint
```
```
