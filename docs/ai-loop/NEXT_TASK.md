# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (small modifications to export functions if needed for testing, but ideally not needed)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing the functions that interact with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getPublicShareLink`, `setPublicShareLink`, `deletePublicShareLink`).
- Use `vi.mock` to mock Firebase SDK dependencies (Firestore instances, doc/collection references, etc.) to ensure tests are isolated unit tests.
- Ensure the tests cover basic CRUD operations and error handling where applicable.
- Run `npm run test` and `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
