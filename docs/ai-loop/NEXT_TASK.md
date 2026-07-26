# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. Phase 2 is active, focusing on improving stability, test coverage, and UX. This task will contribute to test coverage.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting non-exported functions if they are core helpers)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor configuration if required for mocking Firebase, but prefer `vi.mock` directly in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other files outside the allowed scope.

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Focus on adding unit tests for at least 1-2 core helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Ensure tests are isolated and do not interact with actual Firebase.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
