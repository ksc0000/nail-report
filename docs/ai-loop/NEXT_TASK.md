```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key part of this phase is adding unit tests for core utility functions. This task specifically targets the `src/lib/firestore.ts` file, which handles interactions with Firebase Firestore. Establishing a testing foundation for these helpers is crucial for future development and stability.

## Objective

Add Vitest unit tests for the `addItem` and `deleteItem` functions within `src/lib/firestore.ts`. This involves setting up appropriate mocks for the Firebase SDK to isolate the logic under test.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add or adjust exports for testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration changes are needed for mocking)
- `package.json` (only for adding or modifying `devDependencies` if Vitest or related testing libraries are not fully configured yet, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *runtime* npm packages without human approval; *dev dependencies* for testing are allowed if absolutely necessary, but prefer existing setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least the `addItem` and `deleteItem` functions in `src/lib/firestore.ts`.
- Implement mocking for Firebase SDK (Firestore methods like `collection`, `doc`, `addDoc`, `deleteDoc`) using `vitest.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover successful operations and basic error handling scenarios (e.g., what happens if `addDoc` throws an error).
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
