# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The current phase is "2.0" focusing on stability, test coverage, and UX. This task contributes to "2.1 Test coverage".

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves setting up basic test infrastructure if not already present for `src/lib` and writing tests that mock Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions if needed)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if needed for path aliases or globals)
- `package.json` (only for adding `test` script or `vitest` dependencies if not already configured for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, *except* for `vitest` if not yet present)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` as appropriate.
- Write unit tests for at least two core helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover successful operations and basic error scenarios if possible without extensive error handling logic within `firestore.ts` itself.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
