```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for a critical part of the application's data layer: Firestore helper functions. Vitest is the chosen test runner for this project.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, ensuring good coverage for the core CRUD operations.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer minimal changes)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__mocks__/firebase.ts` (new file for Firebase SDK mocks, if needed, or inline mocks within the test file)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval; `vitest` is assumed to be already installed)
-   Firebase deploy commands
-   Secrets and credentials
-   `vite.config.ts` (do not modify global Vitest configuration; assume it's already set up for basic unit testing)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Create a new test file named `src/__tests__/firestore.test.ts`.
-   Write unit tests for the core Firestore helper functions exported from `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
-   Effectively mock the Firebase SDK (Firestore specifically) to isolate the functions under test and avoid actual database interactions. Use `vi.mock` from Vitest for this purpose.
-   Ensure tests cover typical success cases and basic error handling scenarios (e.g., a failed Firestore operation).

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Please implement the unit tests as described above. Focus on robust mocking of Firebase Firestore SDK to ensure tests are fast, isolated, and reliable. Create `src/__tests__/firestore.test.ts` and add tests for the main CRUD helper functions in `src/lib/firestore.ts`.

```
```
