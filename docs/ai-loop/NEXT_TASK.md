# Worker Prompt Template

## Context

The current roadmap is focused on Phase 2, which aims to improve stability, test coverage, and UX. Specifically, sub-phase 2.1 is about improving test coverage. The current task is to begin adding unit tests for core helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task focuses on ensuring the reliability of our Firestore data operations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions)
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
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Focus on testing at least two distinct helper functions in `src/lib/firestore.ts` (e.g., `getNailItems` and `addNailItem` or similar core operations).
- Ensure tests cover basic success cases and potential error scenarios if applicable.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (this task *is* about adding tests).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
