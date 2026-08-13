```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state shows that core AI Loop setup is complete, and a first substantive task is pending. This task focuses on establishing test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies as necessary to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if absolutely necessary, but prioritize testing existing code)
- `src/__tests__/` (specifically, create `src/__tests__/firestore.test.ts` for the new tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but avoid if possible)
- `package.json` (only to add a `test` script if not already present, or modify an existing one to run vitest)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is already assumed to be installed based on roadmap)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least `addItem`, `updateItem`, `deleteItem`, `getItem`, and `getAllItems` from `src/lib/firestore.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`) to ensure tests are isolated and do not interact with a live Firebase project.
- Ensure the tests can be run via `npm test` (or a similar Vitest command).
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
