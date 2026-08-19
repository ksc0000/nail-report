# Worker Prompt Template

## Context

The current roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding foundational unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new test file)
- `src/App.css` (CSS improvements - not relevant for this task but allowed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK (specifically Firestore operations like `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`) using `vitest`'s `vi.mock` to isolate tests from actual Firebase calls.
- Write at least two unit tests for distinct helper functions in `src/lib/firestore.ts`. Good candidates are `createNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Tests should verify the correct calls to the mocked Firebase SDK and/or the correct transformation of data.
- Ensure the tests run successfully.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (this task *is* adding tests for a `src/lib/` file).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
