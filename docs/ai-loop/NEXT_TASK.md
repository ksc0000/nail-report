# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and user experience. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Summary of what changed

This task will introduce unit tests for the functions in `src/lib/firestore.ts` using Vitest. This involves setting up a new test file, mocking Firebase SDK dependencies, and writing basic unit tests to ensure the Firestore helper functions (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) behave as expected, especially concerning their interaction with the Firebase Firestore SDK.

## Changed files list

- `src/__tests__/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (minimal changes, e.g., exporting private functions if necessary for testing, or ensuring public functions are testable)
- `vite.config.ts` (if Vitest setup for mocking Firebase is required, e.g., aliasing for mocks)

## Commands run and results

```bash
npm install # Ensure dev dependencies are installed if vitest isn't already present (it should be)
npm test -- src/__tests__/firestore.test.ts # Run the specific tests
npm run build
npm run lint
```

Expected output: All tests in `firestore.test.ts` pass, `npm run build` succeeds, `npm run lint` reports no errors.

## Known issues or limitations

- The initial set of tests will focus on basic functionality and mocking Firebase SDK. Advanced scenarios like network failures or complex Firestore queries might be deferred to future tasks.
- Mocking Firebase SDK requires careful consideration to avoid tightly coupling tests to the mock implementation details.

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`)
