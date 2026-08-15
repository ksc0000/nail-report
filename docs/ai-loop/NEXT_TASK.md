# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, which focuses on improving stability, test coverage, and UX. The first sub-phase is dedicated to increasing test coverage for core utility functions. Vitest has been selected as the test runner.

## Objective

Implement initial unit tests for at least one helper function within `src/lib/firestore.ts` using Vitest, ensuring basic functionality is covered and the Firebase SDK is properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to exports for testability if strictly necessary, but primary goal is to test *against* existing functions).
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`).
- `package.json` (only to add a `test` script if not already present, no new dependencies).
- `vite.config.ts` or `vitest.config.ts` (minor configuration for Vitest if absolutely needed for this specific task, e.g., basic setup for mocking).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages beyond what's specified in the roadmap or already installed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, for example, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one function from `src/lib/firestore.ts`. Good candidates include `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or `getPublicShare`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) as necessary for isolated unit testing.
- Ensure tests run successfully with `npm run test` (or `vitest`).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
