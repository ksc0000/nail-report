# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task will kickstart the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter functionality)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/setupTests.ts` (if required for Vitest setup, e.g., mocking Firebase)
- `vite.config.ts` (if required for Vitest configuration)
- `package.json` (only if updating existing scripts or dev dependencies for Vitest, but **no new npm package installations**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval; assume Vitest is already a dev dependency or configure it if missing)
- Firebase deploy commands
- Secrets and credentials
- Any files not explicitly listed in "Allowed Scope"

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests that cover the primary helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK calls (Firestore instances, collection references, document references, etc.) to ensure tests are isolated and do not interact with a live Firebase project.
- Aim for good test coverage for the functions tested.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
