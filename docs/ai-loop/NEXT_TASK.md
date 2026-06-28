# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to the original logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest, if not already set up)
- `package.json` (to add `vitest` script, if not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest should be configured using existing devDependencies or if it's considered part of the project's base setup as per roadmap)
- Firebase deploy commands
- Secrets and credentials
- Modifying UI components

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vi.mock` to ensure tests are isolated and do not hit actual Firebase services.
- Focus on testing the core logic of the functions in `src/lib/firestore.ts`.
- Ensure tests cover typical success cases and basic error handling where applicable.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains unit tests for at least two functions exported from `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Tests effectively mock Firebase dependencies and assert on the expected outcomes of the helper functions.
- All new tests pass when `npm run test` is executed.

## Required Test Commands

```bash
npm install # Ensure dev dependencies like vitest are installed
npm run build
npm run lint
npm run test
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
