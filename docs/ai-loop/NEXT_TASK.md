# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first item in Phase 2.1 is "Unit tests for Firestore helper functions (`src/lib/firestore.ts`, `src/lib/storage.ts`, `src/lib/auth.ts`)". This task specifically targets the `firestore.ts` module.

Vitest is specified as the test runner, and mocking Firebase SDK is a key requirement for these tests.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The focus should be on demonstrating how to mock Firebase SDK calls to test the logic within these functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prioritize testing existing logic)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to add Vitest configuration if not already present or to improve it for coverage reporting)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Use Vitest for writing unit tests.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) to test the logic in `src/lib/firestore.ts` without actual Firestore calls.
- Write tests for at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Ensure tests cover basic success cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
