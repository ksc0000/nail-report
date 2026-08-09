```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. The current state shows that no specific unit testing tasks have been completed yet. This task aims to kickstart the test coverage initiative by adding unit tests for a core utility file.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications if needed for testability, e.g., exporting non-exported functions, but prefer not to alter functionality)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if minimal configuration for Vitest is missing and essential for this task, keeping diff small)
-   `package.json` (only to confirm `vitest` is a `devDependency` if not already, but do *not* add new top-level `dependencies` or `devDependencies` without specific instruction)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, unless `vitest` needs to be explicitly added as a `devDependency` and can be done within the line limit as a one-off setup)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Add tests that cover the primary helper functions in `src/lib/firestore.ts`.
-   Mock Firebase SDK interactions using Vitest's mocking capabilities where necessary.
-   Ensure tests are passing.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
