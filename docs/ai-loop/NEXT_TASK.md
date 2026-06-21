# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses `2.1 Test coverage`. The goal is to begin adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`. This will involve setting up mocked Firebase Firestore SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test existing exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration, if absolutely necessary, but Vitest often works out-of-the-box)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use `vitest` for testing and `vi.mock` to mock Firebase Firestore SDK functions (`addDoc`, `collection`, `getDocs`, `query`, `orderBy`, etc.).
- Write tests for at least the `addNailItem` and `getNailItems` functions, covering successful operations and basic error handling if applicable to the existing implementation.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
