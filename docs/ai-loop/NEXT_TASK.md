# Worker Prompt Template

## Context

Phase 2.1 of the roadmap focuses on improving test coverage. This task aims to establish unit tests for critical Firebase helper functions in `src/lib/firestore.ts` using Vitest, ensuring better stability and maintainability.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK dependencies to ensure isolated and reliable testing without actual Firebase interactions.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if necessary for testability, but primarily the target for testing)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (if Vitest configuration specific to mocking is needed, but prefer existing setup)
-   `package.json` (only for adding `vitest` or `jsdom` if not already present in devDependencies, but *only* if strictly necessary and they are common test dependencies, otherwise prefer existing setup) - *Constraint check: "no-new-npm-deps" is active. Assume Vitest is already configured/installed as per roadmap. DO NOT add new npm dependencies.*

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, *except* as noted above for very common test utilities if absolutely missing)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   All new tests must pass when running `npm test`.

### Acceptance Criteria

-   A new test file, `src/__tests__/lib/firestore.test.ts`, must be created.
-   At least one key helper function (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) from `src/lib/firestore.ts` must have basic unit test coverage.
-   Firebase SDK dependencies within `firestore.ts` (e.g., `getDocs`, `collection`, `addDoc`, `doc`, `updateDoc`, `deleteDoc`) must be mocked using `vi.mock` to prevent actual Firebase calls during tests.
-   The tests should verify the correct arguments are passed to the mocked Firebase functions and that the functions handle success/failure scenarios appropriately.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
