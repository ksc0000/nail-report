# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that test coverage (2.1) is a priority. This task aims to kickstart the unit testing efforts by focusing on core Firebase helper functions.

## Objective

Implement Vitest unit tests for helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (minor changes for test setup if absolutely necessary, but Vitest should be configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css` (CSS improvements)
-   `src/App.tsx`

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for the `src/lib/firestore.ts` file.
-   Report follow-up items as comments, not additional code.

## Output Format

### Summary of what changed

Added a new test file `src/__tests__/firestore.test.ts` and implemented unit tests for several helper functions within `src/lib/firestore.ts`. Mocks were used to simulate Firebase SDK behavior.

### Changed files list

-   `src/lib/firestore.ts` (minor, e.g., to ensure functions are exported)
-   `src/__tests__/firestore.test.ts` (new file)

### Commands run and results

```bash
npm install # To ensure all dev dependencies are available
npm test # All new tests should pass
npm run build && npm run lint # Should pass without errors or warnings
```

### Known issues or limitations

-   Initial test coverage for `src/lib/firestore.ts` is partial; not all functions are covered in this first pass.
-   Mocking complexity might increase with more intricate Firebase interactions; only basic CRUD operations are covered.

### Suggested next task

Add Vitest unit tests for helper functions in `src/lib/storage.ts`.
