# Worker Prompt Template

## Context

The product roadmap for nail-report includes "Phase 2 — Active" which focuses on improving stability, test coverage, and UX. Specifically, "2.1 Test coverage" targets adding unit tests for Firebase helper functions in `src/lib/firestore.ts`, utilizing Vitest and `vi.mock` for Firebase SDK mocking.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`. This task involves setting up mocks for Firebase SDK dependencies using Vitest's `vi.mock` functionality.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if needed, but primarily test file creation)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vitest.config.ts` (minor adjustments for mocking setup if necessary, but assume Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages; assume Vitest is already installed as a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for `addNailItem` and `getNailItems` in `src/lib/firestore.ts`.
- Mock Firebase SDK functions (e.g., `addDoc`, `collection`, `getDocs`, `query`) using `vi.mock` to isolate the functions under test.
- Ensure tests cover successful operations and basic error scenarios.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
