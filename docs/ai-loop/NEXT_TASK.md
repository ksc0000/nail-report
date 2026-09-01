# Worker Prompt Template

## Context

The product roadmap is in Phase 2, which focuses on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for a critical utility file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking the Firebase SDK. The goal is to establish a testing foundation for Firestore-related operations.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if strictly necessary, but prefer not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` is not in `devDependencies` and needs to be added, but prefer to assume it's there based on roadmap; if added, ensure `npm install` is *not* run in PR)
- `vite.config.ts` or `vitest.config.ts` (minimal configuration for Vitest if absolutely required, prefer assuming it's ready)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, unless `vitest` needs to be added as a dev dependency if truly missing, but *do not run `npm install`*)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two core functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK calls (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) are properly mocked using `vi.mock` from Vitest.
- Do not make extensive changes to the original `src/lib/firestore.ts` file; focus on testing existing logic.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
