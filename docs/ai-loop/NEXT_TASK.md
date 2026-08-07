```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. Vitest has been selected as the test runner, and Firebase SDK mocking is a requirement for unit tests. This task focuses on `src/lib/firestore.ts`.

## Objective

Add unit tests using Vitest for helper functions within `src/lib/firestore.ts`, specifically mocking the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for reference of functions to test)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest configuration if strictly necessary for mocking setup, but prefer to use existing config if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Implement mocking for Firebase Firestore SDK methods used by `src/lib/firestore.ts` helpers (e.g., `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`). Use `vi.mock('firebase/firestore')`.
- Write at least 2-3 basic unit tests for functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, or `getNailItems`).
- Ensure tests pass successfully.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Prompt

## Summary of what changed

_No changes yet, this is the task definition._

## Changed files list

_No files changed yet, this is the task definition._

## Commands run and results

_No commands run yet, this is the task definition._

## Known issues or limitations

_No issues yet, this is the task definition._

## Suggested next task

Add unit tests using Vitest for helper functions within `src/lib/storage.ts`.
```
