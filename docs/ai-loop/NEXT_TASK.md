# Worker Prompt Template

## Context

The `nail-report` application is moving into Phase 2 of its roadmap, which focuses on improving stability, test coverage, and UX. A key initial step in this phase is enhancing test coverage for core utility functions. This task specifically targets adding unit tests for Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if needed for testability, but focus on testing existing logic)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `vitest.config.ts` (only if absolutely necessary for mocking configuration, otherwise avoid)
-   `package.json` (only for adding a test script, *not* for new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for a possible `vitest.config.ts` or `package.json` for script.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Mock the Firebase SDK (`firebase/firestore`) appropriately using `vi.mock` to isolate the `firestore.ts` helper functions from actual Firebase calls.
-   Write unit tests for at least 2-3 key helper functions within `src/lib/firestore.ts` (e.g., functions for fetching, adding, or updating nail items).
-   Tests should cover successful operations and basic error handling where applicable.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

**Worker prompt:**

Please generate `docs/ai-loop/NEXT_TASK.md` based on the above.
