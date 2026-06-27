# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core helper functions.

## Objective

Add Vitest unit tests for the functions within `src/lib/firestore.ts`. This involves setting up the test file, mocking necessary Firebase SDK dependencies, and writing tests for each exported helper function.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest config needs adjustment for mocking Firebase)
- `package.json` (only if `vitest` needs to be explicitly added to `devDependencies` if not already present, but the roadmap indicates it's part of phase 2.1 setup, so it should exist)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages beyond what's indicated in roadmap for Vitest)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for all exported functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) using `vitest`'s mocking capabilities.
- Ensure tests cover basic success cases for CRUD operations.
- Keep diff ≤ 150 lines.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
