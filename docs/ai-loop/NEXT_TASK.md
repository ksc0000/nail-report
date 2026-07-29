# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets adding unit tests for Firebase helper functions. Vitest is the selected test runner, and Firebase SDK mocking is expected.

This task will kickstart the test coverage efforts by adding unit tests for a key Firestore helper function.

## Objective

Implement unit tests for one or two key data retrieval helper functions within `src/lib/firestore.ts`, such as `getNailItems` (if it exists) or a similar function responsible for fetching data from Firestore. Use Vitest as the test runner and include Firebase SDK mocking where necessary.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting a function if it's not already, but do not alter core business logic)
- `src/__tests__/firestore.test.ts` (new file for the unit tests)
- `vitest.config.ts` (only if Vitest setup for mocking is missing or incomplete, which is unlikely as Vitest is already selected)
- `package.json` (only to ensure `npm test` script correctly runs Vitest, if not already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Focus on testing one or two specific, critical data retrieval functions (e.g., `getNailItems`, `getNailItemById`).
- Use `vi.mock` to mock Firebase SDK functions (e.g., `getDocs`, `doc`, `collection`) as needed to isolate the logic in `firestore.ts`.
- Ensure tests are independent and do not interact with actual Firebase services.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
