```markdown
# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for a critical helper module.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on adding tests for a few key functions (e.g., `createNailItem`, `getNailItems`, or `updateNailItem`) to demonstrate mocking Firebase SDK and testing `firestore.ts` interactions, keeping the PR small and focused.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to configure Vitest if necessary, though it should be pre-configured)
- `package.json` (only for adding `vitest` or `jsdom` if not already present, but prefer not to add new dependencies if possible. Check if Vitest is already configured.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, unless Vitest configuration specifically requires a test utility like `jsdom` not already present; justify in "Known issues")
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any other `src/` files not explicitly allowed

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK using `vi.mock` as required to isolate `firestore.ts` logic.
- Ensure tests cover basic success cases for at least one CRUD operation or data retrieval helper function in `src/lib/firestore.ts`.
- The task is complete when the new tests pass and the code quality checks are green.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
