# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 focuses on improving test coverage. This task aims to kickstart this effort by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for the `addNailItem` and `deleteNailItem` functions within `src/lib/firestore.ts` using Vitest. This task should demonstrate mocking Firebase Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter application logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only to add a `vitest` script if missing, but assume Vitest is already configured for the most part as per roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` (or similar) for the new tests.
- Mock Firebase Firestore SDK calls within the tests to avoid actual database interactions.
- Ensure tests cover successful execution paths for `addNailItem` and `deleteNailItem`.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or `vitest`) and ensure the new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
