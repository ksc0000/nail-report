# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with Firestore.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on testing one or two core helper functions to ensure the basic setup and mocking for Firestore are working correctly.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting a helper)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__tests__/` (new files within this directory)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for new test files in `src/__tests__/`

## Requirements

-   Keep diff ≤ 150 lines.
-   Ensure Vitest is correctly configured to mock Firebase SDK dependencies.
-   Add tests for at least one function in `src/lib/firestore.ts`, such as `getNailItems` or `addNailItem`.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and prevent build errors.
-   Report follow-up items as comments, not additional code.

## Output Format

### Summary of what changed

A brief description of the implemented tests and any necessary modifications for testability.

### Changed files list

List all files that were added, modified, or deleted.

### Commands run and results

Provide the commands executed (e.g., `npm test`, `npm run build`, `npm run lint`) and their respective output summaries (e.g., test pass/fail count, build success/failure, linting issues).

### Known issues or limitations

Any identified problems or limitations in the implemented solution.

### Suggested next task

A specific, bounded task that logically follows the current one, derived from the product roadmap.
