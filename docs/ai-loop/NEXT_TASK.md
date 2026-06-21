# Worker Prompt Template

## Context

The product roadmap indicates Phase 2.1 is focused on improving test coverage. This task initiates that effort by adding unit tests for core Firestore helper functions. The `src/lib/firestore.ts` file contains critical logic for interacting with the `nailItems` and `publicShares` collections.

## Objective

Implement unit tests for two key Firestore helper functions: `getNailItems` and `addNailItem` within `src/lib/firestore.ts`. These tests should mock Firebase SDK dependencies to isolate the logic being tested.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments if needed to enable testing, e.g., dependency injection, though prefer not to modify)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `package.json` (only if a `test` or `test:unit` script for Vitest is missing and needs to be added, but assume Vitest is already configured)
- `vite.config.ts` (for Vitest configuration if necessary, but assume existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval; assume Vitest is already an existing dev dependency or its setup is part of this phase)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file at `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK functions that `getNailItems` and `addNailItem` depend on (e.g., `collection`, `query`, `getDocs`, `addDoc`, `Timestamp`).
- Write at least one positive test case and one edge/error case for `getNailItems`.
- Write at least one positive test case for `addNailItem`.
- The tests should verify the correct invocation of Firebase SDK methods and the transformation/handling of data by the helper functions.
- Keep the overall diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Suggested next task for the AI Loop:** Add Vitest unit tests for `updateNailItem` and `deleteNailItem` in `src/lib/firestore.ts`.
