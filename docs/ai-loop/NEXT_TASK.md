```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. The first item in this phase is "2.1 Test coverage", specifically mentioning unit tests for Firebase helper functions. This task directly addresses that goal by focusing on `src/lib/firestore.ts`.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if absolutely necessary, but prioritize testing existing functions as-is)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (for initial Vitest configuration, if not already complete)
- `src/App.css` (not applicable for this task, but allowed per template)
- `package.json` (only to confirm `vitest` dependency exists, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (no new npm packages or dependency version changes without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least two core helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or any other functions that perform Firestore operations).
- Use Vitest as the test runner.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to test the logic within `firestore.ts` in isolation, without actual Firebase calls.
- Ensure the tests can run successfully using `npm test` or `vitest`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
