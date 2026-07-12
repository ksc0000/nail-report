# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, which focuses on improving stability, test coverage, and UX. A key item in this phase is to increase test coverage for Firebase helper functions. This task specifically targets `src/lib/firestore.ts`.

## Objective

Implement comprehensive unit tests for all exported functions within `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies to ensure tests are isolated and do not interact with actual Firebase services.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to facilitate testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (only if Vitest configuration explicitly needs adjustment for tests, but prefer to use existing config if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other `src/lib/` files beyond `firestore.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for all exported functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Effectively mock Firebase SDK modules and functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using Vitest's `vi.mock` to ensure tests run in isolation without connecting to Firebase.
- Ensure test cases cover happy paths and common error scenarios for each function.
- Verify that `npm run test` passes successfully.
- Run `npm run build && npm run lint` before finishing.
- The generated code should not introduce any new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
