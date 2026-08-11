# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically targets improving test coverage for core Firebase helper functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on testing the core CRUD operations for nail items and tag management as defined in this file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer to test public interfaces)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if absolutely necessary to configure for mocks, but prefer minimal changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/lib/firestore.ts` and `src/__tests__/` paths that are not directly related to setting up `firestore.ts` tests.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to enable isolated unit testing without actual Firebase calls.
- Write tests that cover at least two distinct helper functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Ensure tests assert successful operations and handle potential error paths (if easily mockable).
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
