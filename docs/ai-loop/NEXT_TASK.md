# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. A key item in this phase is improving test coverage, specifically for Firebase helper functions using Vitest.

## Objective

Add unit tests for the functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications if needed for testability, but primarily for understanding what to test)
- `src/lib/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if absolutely necessary to configure for Firebase mocking, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related CSS files
- Any files not directly related to `src/lib/firestore.ts` or its tests.

## Requirements

- Create a new test file: `src/lib/__tests__/firestore.test.ts`.
- Implement unit tests for at least two core functions in `src/lib/firestore.ts` (e.g., a function that reads data and a function that writes data).
- Use `vitest` for the test runner and `vi.mock` to mock Firebase Firestore SDK interactions. Do not make actual calls to Firebase during tests.
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
