# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses test coverage by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (read-only for understanding functions)
- `src/__tests__/` (new test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on adding unit tests for key helper functions that interact with Firestore in `src/lib/firestore.ts`.
- Ensure the Firebase SDK (Firestore specifically) is properly mocked using `vitest`'s mocking capabilities (`vi.mock`).
- Cover both successful execution paths and error handling paths where appropriate for the tested functions.
- Keep the diff ≤ 150 lines. If the `firestore.ts` file is large, prioritize testing a couple of critical functions (e.g., `addNailItem`, `getNailItems`, or a similar core CRUD operation) to stay within the line limit.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
