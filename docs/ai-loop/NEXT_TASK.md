# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically targets the `firestore.ts` helper functions.

## Objective

Implement Vitest unit tests for the Firestore helper functions located in `src/lib/firestore.ts`. Focus on providing initial test coverage for core functions such as `addNailItem` and `getNailItems`, using `vi.mock` to mock Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to enable testing, if necessary, e.g., exporting non-default functions)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest configuration needs adjustment for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any files other than those explicitly allowed above.

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Use Vitest and `vi.mock` to mock the Firebase Firestore SDK to prevent actual database calls during tests.
- Ensure the tests cover basic success cases.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
