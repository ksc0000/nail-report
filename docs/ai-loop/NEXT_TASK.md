# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task targets Phase 2.1: Test coverage, by adding unit tests for existing Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but prefer to test existing functions)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (add aliases or global mocks if required for Firebase SDK mocking)
- `package.json` (add `vitest` scripts if not already present, do not add new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts`. Focus on functions that interact directly with Firestore, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addPublicShare`, `deletePublicShare`, etc.
- Mock the Firebase SDK (Firestore specifically) using Vitest's mocking capabilities (`vi.mock`). Do not make actual calls to Firebase during tests.
- Ensure all tests pass.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
