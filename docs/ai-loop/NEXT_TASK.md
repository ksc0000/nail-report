# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, which targets adding unit tests for core helper functions. Vitest is the chosen test runner.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls to test the logic of these helper functions in isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily for code coverage)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration related to mocking, but prefer to assume Vitest is already configured to run `.test.ts` files)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file not explicitly listed in "Allowed Scope"

## Requirements

-   Keep the total diff for the PR ≤ 150 lines.
-   Add a new test file, `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least one CRUD (Create, Read, Update, or Delete) helper function in `src/lib/firestore.ts`.
-   Ensure Firebase SDK calls (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) are properly mocked using `vi.mock` to test the helper function's logic, not the actual Firebase interaction.
-   The tests should verify that the helper functions correctly call the mocked Firebase methods with the expected arguments and handle their responses.
-   Run `npm run build && npm run lint` before finishing and ensure no errors.
-   Report follow-up items or additional test ideas as comments in the PR description, not by adding more code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
