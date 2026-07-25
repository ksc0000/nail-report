```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by adding unit tests for a critical utility file, `src/lib/firestore.ts`. This is a foundational step to ensure the reliability of data operations.

## Objective

Implement comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Mock the Firebase SDK dependencies to ensure tests are isolated and focus purely on the logic within `firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications if necessary for testability, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (New file for tests)
- `package.json` (Only if adding a test script, e.g., `test:unit`, is absolutely necessary and not already present for Vitest. Avoid adding new dependencies.)
- `vite.config.ts` (Minor modifications for test setup if needed, e.g., aliases, but avoid adding new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope".

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use `vi.mock` to mock the Firebase Firestore SDK to isolate the `src/lib/firestore.ts` functions.
- Write unit tests for at least the primary CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `deletePublicShare`).
- Ensure tests cover both success and potential error paths (if `firestore.ts` functions have explicit error handling logic that can be tested).
- Run `npm run build && npm run lint && npm run test` (or the appropriate Vitest command if different, e.g., `vitest`) before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
