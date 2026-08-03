# Worker Prompt Template

## Context

The project is entering Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for key Firestore helper functions.

## Objective

Implement unit tests for critical helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize adding tests)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary and within line limits, assuming `npm run test` is already configured)
- `package.json` (only to add a `test` script if not present, e.g., `"test": "vitest"`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is assumed to be available)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing at least two core CRUD helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase SDK dependencies as needed (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items (e.g., "more tests needed for X function") as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
