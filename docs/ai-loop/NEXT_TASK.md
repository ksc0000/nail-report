# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes for testability if strictly necessary, but prefer to only add tests)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (if Vitest configuration updates are needed for mocking)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file at `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least the `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
-   Mock Firebase/Firestore SDK dependencies (e.g., `firebase/firestore`) using `vitest`'s `vi.mock` to ensure tests run in isolation without requiring a live Firebase connection.
-   Ensure tests verify the correct interaction with the mocked Firestore API (e.g., `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`).
-   Keep the overall diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing and ensure no errors.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
