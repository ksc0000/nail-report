```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin adding unit test coverage, specifically targeting Firebase helper functions. Vitest is the chosen test runner, and mocking the Firebase SDK is a key requirement for these tests.

## Objective

Implement unit tests for *some* of the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK to isolate the logic under test.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily adding a test file)
- `src/__tests__/firestore.test.ts` (new file for unit tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., functions for adding, getting, updating, or deleting nail items).
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) to ensure tests are isolated and do not interact with actual Firebase services.
- Assert that the Firebase SDK functions are called with the expected arguments.
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
```
