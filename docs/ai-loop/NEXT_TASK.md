# Worker Prompt Template

## Context

The project is moving into Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on ensuring proper interaction with the Firebase SDK (Firestore) and correct data handling.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, if necessary, but primarily for understanding what to test)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` or similar for the new tests)
- `vitest.config.ts` (if minor configuration is needed to enable testing this file, though it should largely be set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other `src/lib/` files not directly related to `firestore.ts` testing.

## Requirements

- Keep the total diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore) as needed to unit test the helper functions in isolation.
- Write tests for at least two key functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover both success and potential error paths where applicable.
- Run `npm test` successfully before finishing.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Summary of what changed:**
Implemented unit tests for `src/lib/firestore.ts` helper functions using Vitest, with Firebase SDK mocking.

**Changed files list:**
- `src/__tests__/firestore.test.ts` (new file)
- Potentially minor, non-functional changes to `src/lib/firestore.ts` to aid testability (e.g., exporting unexported functions, though this should be avoided if possible).

**Commands run and results:**
```bash
npm test # Should pass all new tests
npm run build # Should succeed
npm run lint # Should report no errors
```

**Known issues or limitations:**
- Initial test coverage for `firestore.ts` is partial; more functions can be tested in follow-up tasks.

**Suggested next task:**
Add loading skeleton to nail item list (`src/App.tsx`) to address Phase 2.3 (Loading states).
