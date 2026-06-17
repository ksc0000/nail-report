# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage objective by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK dependencies as needed.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter functionality)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer not to modify)

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
- Write unit tests for at least one or two core helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Mock Firebase SDK functions and Firestore methods (`collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) as necessary using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure the tests are clear, readable, and cover typical success and failure scenarios for the chosen functions.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
