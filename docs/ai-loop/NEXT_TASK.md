```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is focused on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets adding unit tests for Firebase helper functions. The current task is to address the first item on the `Jules-ready Tasks` list, which is to add unit tests for the `src/lib/firestore.ts` file. This will help ensure the reliability of our data operations.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The goal is to cover the core Firestore interaction functions with mocked Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor adjustments are needed for mocking, though unlikely)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing a few key functions to keep the PR small and contained.
- Add a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock the Firebase SDK (e.g., `firestore` module, `doc`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` functions) using `vitest`'s `vi.mock()`.
- Ensure tests cover common Firestore operations handled by functions in `src/lib/firestore.ts` (e.g., adding, getting, updating, deleting documents).
- Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
