# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" sub-phase (2.1) by adding unit tests for a critical `src/lib` helper file.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if absolutely necessary, but primarily for understanding the functions to test)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `package.json` (only to add a `test` script if not already present, pointing to Vitest, but no new `dependencies` or `devDependencies` are allowed unless `vitest` itself is missing, which should be rare at this stage)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages as production dependencies without human approval, and only add `vitest` to `devDependencies` if it's strictly not present for `npm run test`)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure that the primary helper functions within `src/lib/firestore.ts` (e.g., those responsible for CRUD operations on Firestore documents) have unit test coverage.
- Use `vi.mock` to mock Firebase SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`).
- Ensure `npm run test` passes successfully.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
