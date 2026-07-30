# Worker Prompt Template

## Context

The application is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task contributes to enhancing test coverage for core utility functions.

## Objective

Add unit tests for the `addNailItem` and `updateNailItem` functions within `src/lib/firestore.ts` using Vitest, including mocking the Firebase SDK dependencies.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, e.g., exporting non-exported functions, but prefer not to modify core logic).
-   `src/__tests__/lib/firestore.test.ts` (new test file).
-   `package.json` (only to ensure `npm run test` is correctly configured; no new dependencies).
-   `vite.config.ts` (only if Vitest setup is incomplete or needs minor configuration for mocking, but assume basic setup is done).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify).
-   `commands/` (PowerShell scripts — do not modify).
-   `firestore.rules`, `storage.rules` (require human approval).
-   `package.json` deps (no new npm packages without human approval).
-   Firebase deploy commands.
-   Secrets and credentials.
-   Any files outside the specified `Allowed Scope`.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for `addNailItem` and `updateNailItem` functions, ensuring they handle success cases.
-   Mock the Firebase Firestore SDK using `vi.mock` to isolate the functions under test from actual Firebase calls.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
