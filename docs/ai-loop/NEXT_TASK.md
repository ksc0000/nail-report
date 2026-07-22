# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-goal in this phase is to increase test coverage, specifically targeting helper functions. This task directly addresses that objective by establishing a unit testing framework for Firestore helper functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, including mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications if needed for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is needed)
- `package.json` (to add Vitest script if not present, but no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Add unit tests for at least 2-3 core CRUD helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, and/or `updateNailItem`.
- Mock the Firebase Firestore SDK using `vi.mock` to isolate tests from actual Firebase calls.
- Ensure tests cover basic success cases for the selected functions.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
