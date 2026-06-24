# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key objective for this phase is to enhance test coverage, starting with the core utility functions. This task specifically targets adding unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring for testability if necessary, but the primary goal is testing existing logic)
- `src/__tests__/` (create a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only for minimal, necessary Vitest configuration if missing, e.g., adding `globals` or `environment`, but prefer not to modify)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated and do not interact with a live Firebase instance.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover success cases and basic error handling where applicable to the function's logic.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
