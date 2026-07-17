# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for the core helper functions.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls to ensure isolated testing of the business logic within these functions.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but primary focus is testing)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration is absolutely necessary, but assume Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK interactions (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated from actual Firebase calls.
- Write tests for at least two key functions in `src/lib/firestore.ts`, such as `getNailItems` and `addNailItem`.
- Ensure tests cover success cases and basic error handling where applicable within the helper functions.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
