# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no specific Phase 2 task has been completed yet by the AI Loop. This task aims to kickstart the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This directly addresses the "2.1 Test coverage" goal of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor refactoring to enable testing, though primarily adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is required)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or other UI components (focus solely on `firestore.ts` helpers)

## Requirements

- Create a new test file (e.g., `src/__tests__/firestore.test.ts`).
- Write unit tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Mock the Firebase SDK dependencies (Firestore and potentially Auth if relevant to `firestore.ts` functions) using `vi.mock` as needed, ensuring tests are isolated and do not interact with actual Firebase services.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing. All commands must pass without errors.
- Ensure the existing `firestore.ts` functions are not broken by any changes.
- Add meaningful assertions for success and failure cases where applicable.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
