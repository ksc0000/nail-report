# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for existing helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to configure Vitest if not already done, but usually it's set up)
- `package.json` (add Vitest scripts if missing, but no new dependencies)

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
- Write unit tests for at least two key functions within `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for the test runner.
- Mock Firebase SDK dependencies as necessary to ensure true unit tests (e.g., mock `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
- Run `npm run build && npm run lint && npm test` before finishing.
- Ensure all tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
