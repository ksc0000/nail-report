# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding unit tests for core Firebase helper functions.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting internal functions if necessary, but avoid major refactoring)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` or `vitest.config.ts` (minor configuration for test setup if absolutely required and does not add new npm deps)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory other than `vitest.config.ts` (if applicable)

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for all exported helper functions within `src/lib/firestore.ts`.
- Use Vitest for running the tests. Assume Vitest is already configured and available in the project.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore` functions) appropriately to isolate `firestore.ts` logic.
- Ensure the diff for the PR is ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing and ensure all commands pass.
- Report any follow-up items or identified limitations as comments in the PR, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
