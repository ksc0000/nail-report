```markdown
# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase utility functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking the Firebase SDK as necessary to test the logic of the Firestore helper functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible, but the primary focus is on adding tests)
- `src/__tests__/` (for creating `src/__tests__/firestore.test.ts` or similar)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK using `vi.mock` to simulate its behavior without actual network calls.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `addItem`, `getItem`, `updateItem`, `deleteItem`, `getCollection`).
- Ensure the tests are clear, cover basic success cases, and ideally some error conditions if simple to mock.
- Keep the overall diff for this PR to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing and report any issues.
- Report any follow-up items or limitations as comments in the output, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
