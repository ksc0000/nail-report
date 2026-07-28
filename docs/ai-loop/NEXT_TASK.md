```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains critical functions for managing nail items in Firestore. This task focuses on adding initial unit tests for these helpers.

## Objective

Implement unit tests for the `addNailItem` and `getNailItem` helper functions within `src/lib/firestore.ts` using Vitest. This will involve setting up Firebase SDK mocking to ensure tests are isolated and run efficiently without actual Firebase calls.

## Allowed Scope

- `src/lib/firestore.ts` (to understand existing code for testing)
- `src/__tests__/firestore.test.ts` (create this new file for tests)
- `src/setupTests.ts` (if global Vitest setup for Firebase mocking is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` as needed for isolated unit tests.
- Write tests for `addNailItem` to ensure it correctly calls Firestore's `addDoc` and returns expected data.
- Write tests for `getNailItem` to ensure it correctly calls Firestore's `getDoc` and transforms snapshot data.
- Ensure tests pass with `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
