```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding foundational unit tests for core Firebase Firestore helper functions, which is a critical step towards enhancing application reliability.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for export if necessary for testing, but prefer not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (add `test` configuration for Vitest if not already present, minimal changes)

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
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Ensure Firebase SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) are properly mocked using `vitest`'s `vi.mock` to avoid actual Firebase calls during tests.
- Tests should cover typical success cases for the chosen functions.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
