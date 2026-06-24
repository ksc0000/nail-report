# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for core Firebase utility functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on demonstrating how to correctly mock Firebase SDK dependencies for testing purposes.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/` (specifically, create `src/__tests__/firestore.test.ts` for the new tests)
- Any necessary `src/types/` for test mocks if type-safety requires it.

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying UI components (e.g., `src/App.tsx`, `src/components/`) beyond what's strictly necessary for test setup in `src/lib/`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least one key helper function in `src/lib/firestore.ts`, such as `addNailItem` or `getNailItems`.
- Accurately mock Firebase Firestore SDK methods (e.g., `collection`, `addDoc`, `getDocs`) using `vitest`'s mocking capabilities (`vi.mock`).
- The tests should verify the logic of the helper function, not the actual Firebase interaction.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
