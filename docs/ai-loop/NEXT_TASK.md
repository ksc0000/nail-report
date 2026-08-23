# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX. This task addresses the "2.1 Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing the primary CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) and any other pure functions within that file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `package.json` (only for adding `test` script or `vi.mock` configuration if strictly necessary and within current dependencies, no new dependencies)
- `vite.config.ts` (only for Vitest configuration if strictly necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other `src/` files not directly related to `src/lib/firestore.ts` or its tests.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Use Vitest for testing and `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
- Cover at least 3-4 key functions in `src/lib/firestore.ts` with unit tests.
- Ensure tests run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
