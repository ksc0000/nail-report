```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first area of focus in Phase 2 is test coverage. This task aims to kickstart the test coverage by adding unit tests for a core utility file.

## Objective

Add comprehensive unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments if needed for testability)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration if necessary, but prefer to assume Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file at `src/__tests__/firestore.test.ts`.
- Use Vitest for writing tests. Assume Vitest is already installed and configured.
- Mock Firebase SDK functions (e.g., `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `collection`, etc.) to isolate `firestore.ts` logic.
- Write unit tests for at least the following functions in `src/lib/firestore.ts`:
    - `getNailItems`
    - `addNailItem`
    - `updateNailItem`
    - `deleteNailItem`
- Ensure tests cover both successful operations and potential error scenarios where applicable within the `firestore.ts` functions themselves (not Firebase errors directly).
- Keep the overall diff for the PR to ≤ 150 lines.
- Run `npm run build && npm run lint` to ensure code quality and `npm test` (or `vitest`) to ensure tests pass before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
