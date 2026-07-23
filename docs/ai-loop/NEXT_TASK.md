```markdown
# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. A critical part of improving stability is adding unit test coverage for core utility functions. This task specifically targets the `firestore.ts` helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on core CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactors to improve testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., Firestore client, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vitest`'s `vi.mock` to isolate `firestore.ts` logic.
- Implement tests for at least two key Firestore helper functions, such as `getNailItems` and `addNailItem` (or similar core CRUD operations), covering successful execution paths.
- Ensure the tests can run independently without connecting to a live Firebase project.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
