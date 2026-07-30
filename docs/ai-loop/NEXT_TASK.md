# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product is in Phase 2, focusing on stability, test coverage, and UX improvements. No substantive product-level tasks have been completed by Jules yet.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions. This addresses Phase 2.1 (Test coverage).

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test existing exports)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (minor additions for path aliases or mocks if strictly necessary, but avoid significant changes)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Focus on testing the core logic of functions in `src/lib/firestore.ts`, ensuring they correctly interact with a mocked Firebase Firestore SDK.
- Use `vitest` and `vi.mock` for mocking Firebase. Refer to the roadmap's mention of "Mocking Firebase SDK (vitest + vi.mock)".
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
