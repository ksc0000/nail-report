# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is adding unit tests for Firestore helper functions. Vitest has been selected as the test runner.

## Objective

Add Vitest unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor adjustments for mocking are strictly necessary and within line limits)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file (e.g., `src/__tests__/firestore.test.ts`).
- Use Vitest for testing. Assume Vitest is already configured.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) as needed to isolate `firestore.ts` functions.
- Test `addNailItem` to ensure it correctly calls Firestore's `addDoc` with the provided data.
- Test `getNailItems` to ensure it correctly calls Firestore's `getDocs` and maps the results.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
