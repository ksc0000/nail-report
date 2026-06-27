```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX. The first item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically targets the `firestore.ts` helpers.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, to improve test coverage as per the roadmap.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes for testability if needed)
-   `src/__tests__/lib/firestore.test.ts` (new file)
-   `vite.config.ts` (only if Vitest setup is incomplete and required for basic functionality, keep changes minimal)
-   `package.json` (only to add a `test` script if missing, no new npm dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside `src/` except `vite.config.ts` and `package.json` for test setup.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm test` before finishing.
-   Ensure tests mock Firebase SDK methods appropriately to allow isolated testing.
-   Aim for comprehensive test coverage for the functions in `src/lib/firestore.ts`.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

### Summary
Implement unit tests for the helper functions within `src/lib/firestore.ts` to improve test coverage. This involves creating a new test file `src/__tests__/lib/firestore.test.ts`, using Vitest, and mocking Firebase SDK dependencies as necessary to ensure isolated and reliable tests. Focus on functions like `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and any other significant helpers in that file.

### Changed files list
-   `src/lib/firestore.ts` (potentially small, non-functional changes for testability)
-   `src/__tests__/lib/firestore.test.ts` (new file)
-   `vite.config.ts` (if Vitest setup is not complete and requires basic configuration)
-   `package.json` (if `test` script needs to be added or adjusted for Vitest)

### Commands run and results
```bash
npm install # if package.json was modified
npm test
npm run build
npm run lint
```
Report the output of these commands, especially `npm test`.

### Known issues or limitations
-   The complexity of mocking all Firebase dependencies might be high for certain functions, requiring a pragmatic approach to test coverage.
-   If `vite.config.ts` changes are extensive for Vitest setup, it might suggest Vitest was not properly integrated previously. Keep such changes minimal.

### Suggested next task
Add Vitest + unit tests for `src/lib/storage.ts` helpers, continuing with Phase 2.1 test coverage.
```
