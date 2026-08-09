```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage for core Firebase interaction logic.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`. This will involve mocking Firebase SDK dependencies (specifically Firestore instances) to ensure the functions behave as expected when interacting with the mocked services.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactors to improve testability if necessary, but focus on testing)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if absolutely necessary to add a Vitest script, assuming Vitest is already configured to run)
- `vitest.config.ts` (if minimal changes are needed for mock setup, but prefer `vi.mock` directly in test files)

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
- Mock Firebase Firestore SDK methods (e.g., `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, `where`, `doc`, `updateDoc`, `deleteDoc`) as required for testing `addNailItem` and `getNailItems`.
- Write at least one positive test case for `addNailItem` (successful addition).
- Write at least one positive test case for `getNailItems` (successful retrieval of items).
- Ensure error handling paths are considered in tests if `addNailItem` or `getNailItems` explicitly handle errors.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
